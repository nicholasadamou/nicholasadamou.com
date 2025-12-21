#!/usr/bin/env fish

# Default port for MkDocs
set DEFAULT_PORT 8000
# Ports to try if default is taken
set PORTS $DEFAULT_PORT 8001 8002 8003 8004 8005 8080 8888

# Function to check if a port is available
function is_port_available
    set port $argv[1]
    # Use lsof to check if port is in use (works on macOS and Linux)
    not lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1
end

# Find an available port
function find_available_port
    for port in $PORTS
        if is_port_available $port
            echo $port
            return 0
        end
    end
    
    # If no predefined port is available, find a random one
    echo "All predefined ports are taken. Trying to find a random available port..." >&2
    for port in (seq 8000 9000)
        if is_port_available $port
            echo $port
            return 0
        end
    end
    
    echo "ERROR: Could not find an available port" >&2
    return 1
end

# Main execution
set PORT (find_available_port)

if test -z "$PORT"
    echo "Failed to find an available port. Exiting."
    exit 1
end

# Activate virtual environment if it exists
if test -d venv
    source venv/bin/activate.fish
else if test -d ../venv
    source ../venv/bin/activate.fish
else
    echo "Warning: No virtual environment found. Make sure mkdocs is installed." >&2
end

echo "Starting MkDocs server on port $PORT..."
echo "Open http://127.0.0.1:$PORT in your browser"
echo ""

# Start MkDocs with the found port
mkdocs serve --dev-addr "127.0.0.1:$PORT" $argv
