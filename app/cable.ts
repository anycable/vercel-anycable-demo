import { createCable } from "@anycable/web";
import { $user } from "./stores/user";

// TODO: we can only create cable after user is loaded
const url = process.env.CABLE_URL || "ws://localhost:8080/cable";

const userURL = `${url}?username=${$user.get().name}`;

export default createCable(userURL, { protocol: "actioncable-v1-ext-json" });
