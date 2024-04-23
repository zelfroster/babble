package main

import (
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
)

func main() {
	fmt.Println("Welcome to Babble!")

	// Load env
	err := godotenv.Load()
	if err != nil {
		log.Fatal("error loading .env", err)
	}

	DBUSER := os.Getenv("DB_USER")
	DBPASSWORD := os.Getenv("DB_PASSWORD")
	DBNAME := os.Getenv("DB_NAME")
	DBPORT := os.Getenv("DB_PORT")

	app := App{}

	err = app.Initialise(DBUSER, DBPASSWORD, DBNAME, DBPORT)
	if err != nil {
		log.Fatal("error while initialising app", err)
	}
	fmt.Println("App Initialised")

	serverAddress := os.Getenv("SERVER_ADDRESS")

	fmt.Println("Serving on http://localhost:9001")
	app.Run(serverAddress)
}
