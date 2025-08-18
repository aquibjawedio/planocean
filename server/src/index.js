import { server } from "./app.js";
import { env } from "./config/env.js";

const PORT = env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server has started on port ${PORT}`);
});
