#!/usr/bin/env bash

# Default port for MkDocs
DEFAULT_PORT=8000
# Ports to try if default is taken
PORTS=($DEFAULT_PORT 8001 8002 8003 8004 8005 8080 8888)

# Function to check if a port is available
is_port_available() {
    local port=$1
    # Use lsof to check if port is in use (works on macOS and Linux)
    ! lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1
}

# Find an available port
find_available_port() {
    for port in "${PORTS[@]}"; do
        if is_port_available "$port"; then
            echo "$port"
            return 0
        fi
    done
    
    # If no predefined port is available, find a random one
    echo "All predefined ports are taken. Trying to find a random available port..." >&2
    for port in $(seq 8000 9000); do
        if is_port_available "$port"; then
            echo "$port"
            return 0
        fi
    done
    
    echo "ERROR: Could not find an available port" >&2
    return 1
}

# Main execution
PORT=$(find_available_port)

if [ -z "$PORT" ]; then
    echo "Failed to find an available port. Exiting."
    exit 1
fi

# Activate virtual environment if it exists
if [ -d "venv" ]; then
    source venv/bin/activate
elif [ -d "../venv" ]; then
    source ../venv/bin/activate
else
    echo "Warning: No virtual environment found. Make sure mkdocs is installed." >&2
fi

echo "Starting MkDocs server on port $PORT..."
echo "Open http://127.0.0.1:$PORT in your browser"
echo ""

# Start MkDocs with the found port
mkdocs serve --dev-addr "127.0.0.1:$PORT" "$@"
