#!/bin/bash
# start_all.sh - Start all streaming and control services

echo "Starting streaming services..."
echo "================================"
sleep 10
cd ~/Desktop/HackathonPi
# Start stream1.sh in background
echo "Starting stream1.sh..."
./stream1.sh &
STREAM1_PID=$!
echo "stream1.sh started (PID: $STREAM1_PID)"

# Wait 10 seconds
echo "Waiting 10 seconds..."
sleep 10

# Start stream2.sh in background
echo "Starting stream2.sh..."
./stream2.sh &
STREAM2_PID=$!
echo "stream2.sh started (PID: $STREAM2_PID)"

# Wait 10 seconds
echo "Waiting 10 seconds..."
sleep 15

# Start car server (keep it in foreground so we can Ctrl+C to stop everything)
echo "Starting car_server.py..."
echo "Press Ctrl+C to stop all services"
echo "================================"
python ~/Desktop/HackathonPi/car_server.py

# When car_server stops (Ctrl+C), kill the other processes
echo ""
echo "Stopping all services..."
kill $STREAM1_PID 2>/dev/null
kill $STREAM2_PID 2>/dev/null
echo "All services stopped"