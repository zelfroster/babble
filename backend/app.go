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
	var user model.User
	err := json.NewDecoder(req.Body).Decode(&user)
	if err != nil {
		utils.SendError(rw, http.StatusBadRequest, err.Error())
		return
	}

	err = user.VerifyCredentials(app.DB)
	if err != nil {
		utils.SendError(rw, http.StatusBadRequest, err.Error())
		return
	}

	jwtToken, err := utils.GenerateJWT()
	if err != nil {
		utils.SendError(rw, http.StatusInternalServerError, err.Error())
		return
	}

	message := map[string]string{
		"token": jwtToken,
	}

	utils.SendResponse(rw, http.StatusOK, message)
}

func (app *App) GetAllUsers(rw http.ResponseWriter, req *http.Request) {
	users, err := model.GetAllUsers(app.DB)
	if err != nil {
		utils.SendError(rw, http.StatusInternalServerError, err.Error())
		return
	}

	utils.SendResponse(rw, http.StatusOK, users)
}

// Auth Middleware
func Auth(
	endPointHandler func(rw http.ResponseWriter, req *http.Request),
) http.HandlerFunc {
	return http.HandlerFunc(func(rw http.ResponseWriter, req *http.Request) {
		if req.Header["Token"] == nil {
			utils.SendError(
				rw,
				http.StatusUnauthorized,
				fmt.Errorf("You are Unauthorized.").Error(),
			)
		}

		tokenValid, err := utils.VerifyJWT(req.Header["Token"][0])
		if err != nil {
			utils.SendError(rw, http.StatusUnauthorized, err.Error())
		}

		if tokenValid {
			endPointHandler(rw, req)
		} else {
			// case when no error but also token is not validated
			if err == nil {
				utils.SendError(
					rw,
					http.StatusUnauthorized,
					fmt.Errorf("Incorrect Token Provided.").Error(),
				)
			}
		}
	})
}

func (app *App) handleRoutes() {
	fmt.Println("calling ws setup")
	app.SetupWsRoutes()
	app.Router.HandleFunc("/signup", app.SignUpHandler).Methods("POST", "OPTIONS")
	app.Router.HandleFunc("/signin", app.SignInHandler).Methods("POST", "OPTIONS")
	app.Router.HandleFunc("/user/bulk", Auth(app.GetAllUsers)).Methods(
		"GET", "OPTIONS",
	)
}

func (app *App) Initialise(
	DBUSER string, DBPASSWORD string, DBNAME string, DBPORT string,
) error {
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
	methods := handlers.AllowedMethods([]string{
		"GET", "POST", "PUT", "DELETE", "OPTIONS",
	})
	origins := handlers.AllowedOrigins([]string{"*"})
	router.Use(handlers.CORS(headers, methods, origins))

	app.handleRoutes()

	return nil
}

func (app *App) Run(address string) {
	log.Fatal(http.ListenAndServe(address, app.Router))
}
