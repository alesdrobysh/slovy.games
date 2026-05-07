// This file has been refactored to use Clean Architecture.
// The GameEngine class has been moved to GameService in core/use-cases/
// and now uses dependency injection instead of direct filesystem access.
//
// For backward compatibility, this file re-exports the new gameService.
export { gameService } from "./container";
