package utils

import (
	"encoding/json"
	"net/http"
)

func SendResponse(rw http.ResponseWriter, statusCode int, payload interface{}) {
	response, _ := json.Marshal(payload)
	rw.Header().Set("Content-Type", "application/json")
	// rw.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	rw.WriteHeader(statusCode)
	rw.Write(response)
}

func SendError(rw http.ResponseWriter, statusCode int, err string) {
	errorMessage := map[string]string{"error": err}
	SendResponse(rw, statusCode, errorMessage)
}
