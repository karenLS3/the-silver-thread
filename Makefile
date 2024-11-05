# Load .env file if it exists
ifneq (,$(wildcard ./.env))
    include .env
    export $(shell sed 's/=.*//' .env)
endif
DELAY = 10  # Delay in seconds before starting the React Native app

# Default target to start the Android emulator and React Native app
start-react:
	@echo "Starting Android emulator..."
	@$(ANDROID_HOME)/emulator/emulator -avd $(EMULATOR_NAME) &
	@echo "Waiting for $(DELAY) seconds for the emulator to start..."
	@sleep $(DELAY)	
	@echo "Starting React Native app..."
	@cd app && npm start &
	@cd app && npm run android &

# Target to stop the React Native server and emulator
stop-react:
	@echo "Stopping React Native server..."
	@pkill -f "npm start"
	@echo "Stopping Android emulator..."
	@adb -s emulator-5554 emu kill

# Target to start the Python server
start-python:
	@echo "Starting Python server..."
	@. venv/bin/activate && cd api && python manage.py runserver &

# Target to stop the Python server
stop-python:
	@echo "Stopping Python server..."
	@pkill -f "python manage.py runserver"

# Default target to start both the Android emulator, React Native app, and Python server
start-all: start-react start-python
	@echo "All services started."

# Target to stop all services
stop-all: stop-react stop-python
	@echo "All services stopped."

# Clean up
.PHONY: start-react stop-react start-python stop-python start-all stop-all
