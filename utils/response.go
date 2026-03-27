package utils

import (
    "encoding/json"
    "net/http"
)

type APIResponse struct {
    Success bool        `json:"success"`
    Data    interface{} `json:"data,omitempty"`
    Message string      `json:"message,omitempty"`
    Error   string      `json:"error,omitempty"`
}

func SendSuccess(w http.ResponseWriter, data interface{}, message string) {
    response := APIResponse{
        Success: true,
        Data:    data,
        Message: message,
    }
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(response)
}

func SendError(w http.ResponseWriter, errMsg string, status int) {
    response := APIResponse{
        Success: false,
        Error:   errMsg,
    }
    w.WriteHeader(status)
    json.NewEncoder(w).Encode(response)
}
