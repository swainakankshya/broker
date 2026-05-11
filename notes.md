// Tailwind installation

 --> npm install tailwindcss@latest @tailwindcss/vite@latest
 --> import in index.css -  @import "tailwindcss";
 --> add in vite.config.js

    import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})

 --> app.jsx - import './index.css'

 <!-- ======================  FONT AWESOME ============================================================= -->
 1.install
 npm i --save @fortawesome/fontawesome-svg-core @fortawesome/react-fontawesome @fortawesome/free-solid-svg-icons
 2. import example
 import { faUser, faTruck, faBox } from '@fortawesome/free-solid-svg-icons'
 return( <FontAwesomeIcon icon={faUser} className="text-xl text-blue-600" />
      <FontAwesomeIcon icon={faTruck} className="ml-4 text-xl text-green-600" />
      <FontAwesomeIcon icon={faBox} className="ml-4 text-xl text-gray-600" />
)

<!-- ---- -->
1.Use useeffect for api call instead on onselect
<!-- Date picker -->
npm install react-datepicker