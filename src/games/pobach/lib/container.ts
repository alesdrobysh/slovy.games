import { GameService } from "../core/use-cases/GameService";
import { FileGameRepository } from "../infrastructure/repositories/FileGameRepository";

/**
 * Dependency injection container for the Clean Architecture setup.
 * Acts as the composition root that wires together all dependencies.
 */

const repository = new FileGameRepository(`${process.cwd()}/src/data`);
const gameService = new GameService(repository);
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

// Export the service and initialization function
export { gameService, initializeGameService };
