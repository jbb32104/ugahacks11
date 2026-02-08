# car.py
import RPi.GPIO as GPIO
import time

class Car:
    def __init__(self):
        """Initialize the car with GPIO pins and PWM setup"""
        # GPIO pin assignments
        self.LEFT_A = 18   # Left motors forward
        self.LEFT_B = 12   # Left motors backward
        self.RIGHT_A = 13  # Right motors forward
        self.RIGHT_B = 19  # Right motors backward
        self.PUMP = 23     # Water pump
        
        # PWM frequency (Hz)
        self.PWM_FREQ = 1000
        
        # Current speed (0-100)
        self.current_speed = 0
        
        # Setup GPIO
        GPIO.setmode(GPIO.BCM)
        GPIO.setwarnings(False)
        
        # Setup motor pins as outputs
        GPIO.setup(self.LEFT_A, GPIO.OUT)
        GPIO.setup(self.LEFT_B, GPIO.OUT)
        GPIO.setup(self.RIGHT_A, GPIO.OUT)
        GPIO.setup(self.RIGHT_B, GPIO.OUT)
        GPIO.setup(self.PUMP, GPIO.OUT)
        
        # Initialize PWM objects
        self.pwm_left_a = GPIO.PWM(self.LEFT_A, self.PWM_FREQ)
        self.pwm_left_b = GPIO.PWM(self.LEFT_B, self.PWM_FREQ)
        self.pwm_right_a = GPIO.PWM(self.RIGHT_A, self.PWM_FREQ)
        self.pwm_right_b = GPIO.PWM(self.RIGHT_B, self.PWM_FREQ)
        
        # Start all PWM with 0% duty cycle
        self.pwm_left_a.start(0)
        self.pwm_left_b.start(0)
        self.pwm_right_a.start(0)
        self.pwm_right_b.start(0)
        
        # Pump starts off
        GPIO.output(self.PUMP, GPIO.LOW)
        
        print("Car initialized successfully")
    
    def _set_motor_speeds(self, left_a_duty, left_b_duty, right_a_duty, right_b_duty):
        """Internal method to set PWM duty cycles for all motors"""
        self.pwm_left_a.ChangeDutyCycle(left_a_duty)
        self.pwm_left_b.ChangeDutyCycle(left_b_duty)
        self.pwm_right_a.ChangeDutyCycle(right_a_duty)
        self.pwm_right_b.ChangeDutyCycle(right_b_duty)
    
    def forward(self, speed=50):
        """
        Move forward at specified speed
        Args:
            speed: Speed percentage (0-100)
        """
        speed = max(0, min(100, speed))
        self.current_speed = speed
        self._set_motor_speeds(speed, 0, speed, 0)
        print(f"Moving forward at {speed}%")
    
    def backward(self, speed=50):
        """
        Move backward at specified speed
        Args:
            speed: Speed percentage (0-100)
        """
        speed = max(0, min(100, speed))
        self.current_speed = speed
        self._set_motor_speeds(0, speed, 0, speed)
        print(f"Moving backward at {speed}%")
    
    def turn_left(self, speed=50):
        """
        Turn left in place (left motors backward, right motors forward)
        Args:
            speed: Speed percentage (0-100)
        """
        speed = max(0, min(100, speed))
        self.current_speed = speed
        self._set_motor_speeds(0, speed, speed, 0)
        print(f"Turning left at {speed}%")
    
    def turn_right(self, speed=50):
        """
        Turn right in place (left motors forward, right motors backward)
        Args:
            speed: Speed percentage (0-100)
        """
        speed = max(0, min(100, speed))
        self.current_speed = speed
        self._set_motor_speeds(speed, 0, 0, speed)
        print(f"Turning right at {speed}%")
    
    def forward_left(self, speed=50, turn_ratio=0.3):
        """
        Move forward while turning left (slow down left motors)
        Args:
            speed: Speed percentage (0-100)
            turn_ratio: How much to slow the turning side (0.0-1.0)
        """
        speed = max(0, min(100, speed))
        self.current_speed = speed
        left_speed = speed * (1 - turn_ratio)
        self._set_motor_speeds(left_speed, 0, speed, 0)
        print(f"Moving forward-left at {speed}%")
    
    def forward_right(self, speed=50, turn_ratio=0.3):
        """
        Move forward while turning right (slow down right motors)
        Args:
            speed: Speed percentage (0-100)
            turn_ratio: How much to slow the turning side (0.0-1.0)
        """
        speed = max(0, min(100, speed))
        self.current_speed = speed
        right_speed = speed * (1 - turn_ratio)
        self._set_motor_speeds(speed, 0, right_speed, 0)
        print(f"Moving forward-right at {speed}%")
    
    def backward_left(self, speed=50, turn_ratio=0.3):
        """
        Move backward while turning left (slow down left motors)
        Args:
            speed: Speed percentage (0-100)
            turn_ratio: How much to slow the turning side (0.0-1.0)
        """
        speed = max(0, min(100, speed))
        self.current_speed = speed
        left_speed = speed * (1 - turn_ratio)
        self._set_motor_speeds(0, left_speed, 0, speed)
        print(f"Moving backward-left at {speed}%")
    
    def backward_right(self, speed=50, turn_ratio=0.3):
        """
        Move backward while turning right (slow down right motors)
        Args:
            speed: Speed percentage (0-100)
            turn_ratio: How much to slow the turning side (0.0-1.0)
        """
        speed = max(0, min(100, speed))
        self.current_speed = speed
        right_speed = speed * (1 - turn_ratio)
        self._set_motor_speeds(0, speed, 0, right_speed)
        print(f"Moving backward-right at {speed}%")
    
    def stop(self):
        """Stop all motors"""
        self._set_motor_speeds(0, 0, 0, 0)
        self.current_speed = 0
        print("Car stopped")
    
    def pump_on(self):
        """Turn water pump on"""
        GPIO.output(self.PUMP, GPIO.HIGH)
        print("Pump ON")
    
    def pump_off(self):
        """Turn water pump off"""
        GPIO.output(self.PUMP, GPIO.LOW)
        print("Pump OFF")
    
    def cleanup(self):
        """Clean up GPIO and stop all PWM"""
        self.stop()
        self.pump_off()
        self.pwm_left_a.stop()
        self.pwm_left_b.stop()
        self.pwm_right_a.stop()
        self.pwm_right_b.stop()
        GPIO.cleanup()
        print("GPIO cleaned up")


if __name__ == "__main__":
    try:
        car = Car()
        
        print("\n=== Testing Both Sides ===\n")
        
        # Test left side only
        # print("Testing LEFT motors only (should turn right)")
        # car._set_motor_speeds(70, 0, 0, 0)
        # time.sleep(3)
        # car.stop()
        # time.sleep(1)
        
        # Test right side only
        print("Testing RIGHT motors only (should turn left)")
        car._set_motor_speeds(0, 0, 70, 0)
        time.sleep(3)
        car.stop()
        time.sleep(1)
        
        # Test both forward
        print("Testing BOTH forward")
        car.forward(70)
        time.sleep(3)
        car.stop()
        
    except KeyboardInterrupt:
        print("\nStopped by user")
    finally:
        car.cleanup()