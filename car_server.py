# joystick_server.py
import asyncio
import websockets
import json
from car import Car

# Store connected clients
connected_clients = set()
car_instance = None

def joystick_to_motor_speeds(x, y):
    """
    Convert joystick position to motor speeds using tank/arcade drive
    
    Args:
        x: Joystick X position (-1 to 1, left to right)
        y: Joystick Y position (-1 to 1, down to up)
    
    Returns:
        (left_speed, right_speed): Motor speeds from 0-100
        (left_forward, right_forward): Booleans indicating direction
    """
    # Dead zone to prevent drift when joystick is centered
    DEAD_ZONE = 0.1
    if abs(x) < DEAD_ZONE and abs(y) < DEAD_ZONE:
        return 0, 0, True, True
    
    # Arcade drive mixing
    # Y controls forward/backward, X controls turning
    left_power = y + x
    right_power = y - x
    
    # Normalize to -1 to 1 range
    max_power = max(abs(left_power), abs(right_power))
    if max_power > 1.0:
        left_power /= max_power
        right_power /= max_power
    
    # Determine direction
    left_forward = left_power >= 0
    right_forward = right_power >= 0
    
    # Convert to 0-100 range, then map to 30-100 for actual output
    # (0 means stop, otherwise minimum is 30)
    left_speed = abs(left_power) * 100
    right_speed = abs(right_power) * 100
    
    # Apply minimum speed threshold (30) when not stopped
    MIN_SPEED = 40
    MAX_SPEED = 100
    
    if left_speed > 0:
        left_speed = MIN_SPEED + (left_speed / 100) * (MAX_SPEED - MIN_SPEED)
    if right_speed > 0:
        right_speed = MIN_SPEED + (right_speed / 100) * (MAX_SPEED - MIN_SPEED)
    
    return left_speed, right_speed, left_forward, right_forward

async def handle_client(websocket):
    """Handle incoming WebSocket connections and control the car"""
    global car_instance
    
    # Initialize car once on first connection
    if car_instance is None:
        print("Initializing car...")
        car_instance = Car()
        print("Car initialized!")
    
    # Register client
    connected_clients.add(websocket)
    print(f"Client connected from {websocket.remote_address}")
    print(f"Total clients: {len(connected_clients)}")
    
    try:
        async for message in websocket:
            try:
                data = json.loads(message)
                
                # Extract joystick values
                x = data.get('joystick_x', 0)
                y = data.get('joystick_y', 0)
                squirt = data.get('squirt', False)
                
                print(f"Joystick: X={x:.2f}, Y={y:.2f}, Squirt={squirt}")
                
                # Calculate motor speeds
                left_speed, right_speed, left_forward, right_forward = joystick_to_motor_speeds(x, y)
                
                # Set motor speeds based on direction
                left_a = left_speed if left_forward else 0
                left_b = left_speed if not left_forward else 0
                right_a = right_speed if right_forward else 0
                right_b = right_speed if not right_forward else 0
                
                # Apply to car
                car_instance._set_motor_speeds(left_a, left_b, right_a, right_b)
                
                print(f"  Motors -> L_fwd={left_a:.0f}, L_bck={left_b:.0f}, R_fwd={right_a:.0f}, R_bck={right_b:.0f}")
                
                # Handle squirt/pump
                if squirt:
                    car_instance.pump_on()
                else:
                    car_instance.pump_off()
                
                # Send acknowledgment
                await websocket.send(json.dumps({
                    'status': 'ok',
                    'left_speed': left_speed,
                    'right_speed': right_speed,
                    'left_forward': left_forward,
                    'right_forward': right_forward
                }))
                
            except json.JSONDecodeError as e:
                print(f"Invalid JSON: {e}")
            except Exception as e:
                print(f"Error: {e}")
                import traceback
                traceback.print_exc()
    
    except websockets.exceptions.ConnectionClosed as e:
        print(f"Client disconnected: {e}")
    except Exception as e:
        print(f"Unexpected error: {e}")
        import traceback
        traceback.print_exc()
    finally:
        # Unregister client
        if websocket in connected_clients:
            connected_clients.remove(websocket)
        
        # Stop car if no clients connected
        if len(connected_clients) == 0 and car_instance:
            print("No clients connected - stopping car")
            car_instance.stop()
        
        print(f"Remaining clients: {len(connected_clients)}")

async def main():
    """Start WebSocket server on port 8765"""
    async with websockets.serve(handle_client, "0.0.0.0", 8765):
        print("=" * 50)
        print("Car Control WebSocket Server Started")
        print("Listening on ws://0.0.0.0:8765")
        print("Ready to receive joystick commands...")
        print("=" * 50)
        await asyncio.Future()  # Run forever

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n" + "=" * 50)
        print("Server stopped")
        if car_instance:
            car_instance.cleanup()
        print("=" * 50)