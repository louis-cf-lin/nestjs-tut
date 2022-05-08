import { Controller, Get } from "@nestjs/common";

// Controller decorator
@Controller("/app") // route prefix
export class AppController {
  @Get("/some-route-name") // route name, i.e. /app/some-route-name
  getRootRoute() {
    return "hi there";
  }
  @Get("/bye") // /app/bye
  getByeThere() {
    return "bye there!";
  }
}
