import json
import logging
from typing import Dict, Any, Optional

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class SquirtasticController:
    """
    Handles incoming JSON command packets from the Next.js frontend.
    Routes each packet type to its corresponding handler method.
    """

    def __init__(self):
        """Initialize the controller."""
        self.running = True

    def process_command(self, json_data: str) -> bool:
        """
        Parse and process incoming JSON command packet.

        Args:
            json_data: JSON string containing the command.

        Returns:
            True if command was processed successfully, False otherwise.
        """
        try:
            command: Dict[str, Any] = json.loads(json_data)
            command_type = command.get("type")

            if command_type == "joystick":
                self._handle_joystick(command)
            elif command_type == "sound":
                self._handle_sound(command)
            elif command_type == "squirt":
                self._handle_squirt(command)
            else:
                logger.warning(f"Unknown command type: {command_type}")
                return False

            return True

        except json.JSONDecodeError as e:
            logger.error(f"Invalid JSON: {e}")
            return False
        except Exception as e:
            logger.error(f"Error processing command: {e}")
            return False

    def _handle_joystick(self, command: Dict[str, Any]) -> None:
        """
        Handle joystick input command.

        Args:
            command: Dict with 'x' and 'y' normalized values (-1 to 1).

        Example:
            {"type": "joystick", "x": 0.85, "y": -0.62}
        """
        x = command.get("x", 0.0)
        y = command.get("y", 0.0)

        logger.info(f"Joystick: x={x:.2f}, y={y:.2f}")

        # TODO: Add actual motor/servo control logic here
        # Example:
        #   - Move robot forward/backward based on y
        #   - Turn left/right based on x
        #   - Set motor speeds proportional to magnitude
        pass

    def _handle_sound(self, command: Dict[str, Any]) -> None:
        """
        Handle soundboard button press.

        Args:
            command: Dict with 'id' (1-8) indicating which sound to play.

        Example:
            {"type": "sound", "id": 3}
        """
        sound_id = command.get("id")

        if not isinstance(sound_id, int) or sound_id < 1 or sound_id > 8:
            logger.warning(f"Invalid sound ID: {sound_id}")
            return

        logger.info(f"Playing sound: {sound_id}")

        # TODO: Add actual audio playback logic here
        # Example:
        #   - Load and play sound file associated with sound_id
        #   - Could use pygame, pydub, or system audio APIs
        pass

    def _handle_squirt(self, command: Dict[str, Any]) -> None:
        """
        Handle SQUIRT button press (water/air pump activation).

        Args:
            command: Dict with type='squirt'.

        Example:
            {"type": "squirt"}
        """
        logger.info("SQUIRT activated!")

        # TODO: Add actual squirt/pump control logic here
        # Example:
        #   - Trigger relay to activate water pump
        #   - Pulse GPIO pin connected to solenoid/pump
        #   - Set pump duration/intensity
        pass

    def run(self) -> None:
        """
        Main event loop for receiving and processing commands.
        This is a placeholder — integrate with your WebSocket server.
        """
        logger.info("SquirtasticController started. Waiting for commands...")
        while self.running:
            # TODO: Integrate with WebSocket server to receive json_data
            # Example:
            #   - Connect to JSMpeg WebSocket server
            #   - Receive incoming JSON packets
            #   - Call self.process_command(json_data) for each packet
            pass

    def stop(self) -> None:
        """Stop the controller."""
        self.running = False
        logger.info("SquirtasticController stopped.")


if __name__ == "__main__":
    controller = SquirtasticController()

    # Example usage / testing
    test_packets = [
        '{"type": "joystick", "x": 0.85, "y": -0.62}',
        '{"type": "joystick", "x": 0, "y": 0}',
        '{"type": "sound", "id": 1}',
        '{"type": "sound", "id": 5}',
        '{"type": "squirt"}',
    ]

    logger.info("Testing SquirtasticController with sample packets...")
    for packet in test_packets:
        logger.info(f"Processing: {packet}")
        controller.process_command(packet)