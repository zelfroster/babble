package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	_ "github.com/lib/pq"
	"github.com/zelfroster/babble/model"
	"github.com/zelfroster/babble/pkg/websocket"
	"github.com/zelfroster/babble/utils"
)

type App struct {
	Router *mux.Router
	DB     *sql.DB
}

func serveWS(pool *websocket.Pool, w http.ResponseWriter, r *http.Request) {
	fmt.Println("websocket endpoint reached")

	conn, err := websocket.Upgrade(w, r)
	if err != nil {
		fmt.Fprintf(w, "%+v\n", err)
	}

	client := &websocket.Client{
		Conn: conn,
		Pool: pool,
	}

	pool.Register <- client
	client.Read()
}

func (app *App) SetupWsRoutes() {
	fmt.Println("Setup routes called")
	pool := websocket.NewPool()
	go pool.Start()

	app.Router.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		serveWS(pool, w, r)
	})
}

func (app *App) SignUpHandler(rw http.ResponseWriter, req *http.Request) {
	var user model.User
	err := json.NewDecoder(req.Body).Decode(&user)
	if err != nil {
		utils.SendError(rw, http.StatusBadRequest, err.Error())
		return
	}

	err = user.RegisterUser(app.DB)
	if err != nil {
		utils.SendError(rw, http.StatusBadRequest, err.Error())
		return
	}
	message := map[string]string{
		"message": "Sign up successful",
	}
	utils.SendResponse(rw, http.StatusOK, message)
}

func (app *App) SignInHandler(rw http.ResponseWriter, req *http.Request) {
}

func (app *App) GetAllUsers(rw http.ResponseWriter, req *http.Request) {
	users, err := model.GetAllUsers(app.DB)
	if err != nil {
		utils.SendError(rw, http.StatusInternalServerError, err.Error())
		return
	}

	utils.SendResponse(rw, http.StatusOK, users)
}

func (app *App) handleRoutes() {
	fmt.Println("calling ws setup")
	app.SetupWsRoutes()
	app.Router.HandleFunc("/signup", app.SignUpHandler).Methods("POST", "OPTIONS")
	app.Router.HandleFunc("/signin", app.SignInHandler).Methods("POST", "OPTIONS")
	app.Router.HandleFunc("/user/bulk", app.GetAllUsers).Methods("GET", "OPTIONS")
}

func (app *App) Initialise(DBUSER string, DBPASSWORD string, DBNAME string, DBPORT string) error {
	psqlconn := fmt.Sprintf(
		"user=%s dbname=%s sslmode=disable port=%v password=%s",
		DBUSER,
		DBNAME,
		DBPORT,
		DBPASSWORD,
	)

	var err error
	app.DB, err = sql.Open("postgres", psqlconn)
	if err != nil {
		log.Fatal("error while connecting to db", err)
		return err
	}

	router := mux.NewRouter().StrictSlash(true)

	app.Router = router

	// add cors headers
	headers := handlers.AllowedHeaders(
		[]string{"X-Requested-With", "Content-Type", "Authorization"},
	)
	methods := handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE", "OPTIONS"})
	origins := handlers.AllowedOrigins([]string{"*"})
	router.Use(handlers.CORS(headers, methods, origins))

	fmt.Println("call handleRoutes")
	app.handleRoutes()

	return nil
}

func (app *App) Run(address string) {
	log.Fatal(http.ListenAndServe(address, app.Router))
}
