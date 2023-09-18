import { computed } from "nanostores";
import { $roomId } from "./messages";
import { $cable } from "./cable";

export const $init = computed([$cable, $roomId], () => {});
