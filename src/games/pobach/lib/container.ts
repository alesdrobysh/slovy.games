import { GameService } from "./game-service";

const gameService = new GameService();
let isInitialized = false;

const initializeGameService = async (): Promise<void> => {
	if (isInitialized) return;

	try {
		await gameService.initialize();
		isInitialized = true;
		console.log("✅ GameService initialized successfully");
	} catch (error) {
		console.error("❌ Failed to initialize GameService:", error);
		throw error;
	}
};

export { gameService, initializeGameService };
