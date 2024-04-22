package model

import (
	"database/sql"
	"errors"
	"fmt"

	"golang.org/x/crypto/bcrypt"
)

type User struct {
	Id        int    `json:"id"`
	Username  string `json:"username"  validate:"required,max=20"`
	Email     string `json:"email"     validate:"required,email"`
	Password  string `json:"password"  validate:"required,min=8"`
	FirstName string `json:"firstName" validate:"max=30"`
	LastName  string `json:"lastName"  validate:"max=30"`
}

func (user *User) RegisterUser(db *sql.DB) error {
	fmt.Println(user)

	queryString := fmt.Sprintf(
		"SELECT EXISTS(SELECT * FROM users WHERE email='%s' OR username='%s')",
		user.Email,
		user.Username,
	)

	var emailOrUsernameExists bool
	db.QueryRow(queryString).Scan(&emailOrUsernameExists)

	if emailOrUsernameExists {
		return errors.New("email or username already exists in the database")
	}

	// add salt and hash the password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		fmt.Println("error generating hash from password", err)
		return err
	}

	queryString = fmt.Sprintf(
		`INSERT INTO users (username, email, password, firstname, lastname) VALUES 
    ('%s', '%s', '%s', '%s', '%s') RETURNING *`,
		user.Username,
		user.Email,
		string(hashedPassword),
		user.FirstName,
		user.LastName,
	)

	err = db.QueryRow(queryString).Scan(
		&user.Id,
		&user.Username,
		&user.Email,
		&user.Password,
		&user.FirstName,
		&user.LastName,
	)

	fmt.Println(user)
	if err != nil {
		return err
	}
	return nil
}

func (user *User) SignInUser(db *sql.DB) {
	// @TODO: Add logic to sign in user
}

// Temporary route to get all users
func GetAllUsers(db *sql.DB) ([]User, error) {
	queryString := fmt.Sprintf("SELECT * FROM users;")

	rows, err := db.Query(queryString)
	if err != nil {
		return nil, err
	}

	users := []User{}

	for rows.Next() {
		var user User
		err := rows.Scan(
			&user.Id,
			&user.Username,
			&user.Email,
			&user.Password,
			&user.FirstName,
			&user.LastName,
		)
		if err != nil {
			return nil, err
		}
		users = append(users, user)
	}

	return users, nil
}
