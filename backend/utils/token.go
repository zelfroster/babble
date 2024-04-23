package utils

import (
	"encoding/base64"
	"fmt"
	"os"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

// Method to decode and test if JWT is correctly built
func decodeJWT(jwtTokenString string) {
	// Split the token string into its components (header, payload, signature)
	parts := strings.Split(jwtTokenString, ".")
	if len(parts) != 3 {
		fmt.Println("Invalid JWT token format: expected 3 parts separated by dots")
		return
	}

	// Decode each part
	header, err := base64.RawURLEncoding.DecodeString(parts[0])
	if err != nil {
		fmt.Println("Error decoding header:", err)
		return
	}
	payload, err := base64.RawURLEncoding.DecodeString(parts[1])
	if err != nil {
		fmt.Println("Error decoding payload:", err)
		return
	}
	signature := parts[2]

	fmt.Println("Header:", string(header))
	fmt.Println("Payload:", string(payload))
	fmt.Println("Signature:", signature)
}

func GenerateJWT() (string, error) {
	SECRET_KEY := os.Getenv("SECRET_KEY")
	SecretKey := []byte(SECRET_KEY)

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"exp":        time.Now().Add(10 * time.Minute).Unix(),
		"authorized": true,
	})
	tokenString, err := token.SignedString(SecretKey)
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

func VerifyJWT(jwtTokenString string) (bool, error) {
	SECRET_KEY := os.Getenv("SECRET_KEY")
	SecretKey := []byte(SECRET_KEY)

	token, err := jwt.Parse(jwtTokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Unexpected Signing Method: %v", token.Header["alg"])
		}
		return SecretKey, nil
	})
	if err != nil {
		return false, fmt.Errorf("Error parsing jwt token: %v", err)
	}
	if claims, ok := token.Claims.(jwt.MapClaims); ok {
		// @TODO: Check expiration time of token
		fmt.Println(claims["authorized"], claims["exp"])
		return token.Valid, nil
	} else {
		return false, err
	}
}
