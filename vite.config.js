import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: "0.0.0.0",
    port: 5199,
    strictPort: true,
    /* HMR mặc định dùng cùng cổng với server — trước đây bị ghim ở 3000
       khiến client không kết nối được WS và reload trang vô hạn */
    watch: {
      ignored: ["**/.firebase/**", "**/dist/**", "**/firebase-debug.log"],
    },
  },
});
