# Goal Gurus - Team Shuffler

Aplicación web para armar equipos balanceados en eventos deportivos. Permite ingresar jugadores con sus habilidades y roles, generando automáticamente múltiples opciones de equipos equilibrados tanto en nivel de juego como en distribución de posiciones.

## 🚀 Características

- ✅ Ingreso rápido de jugadores con nombre, nivel y rol
- ⚖️ Generación de equipos balanceados por nivel de habilidad
- 🎯 Balance inteligente por roles/posiciones (Arquero, Defensa, Mediocampista, Ataque)
- 📊 Múltiples opciones de equipos ordenadas por calidad de balance
- 🎨 Interfaz moderna y responsive con Next.js 15 y TailwindCSS
- 📱 Diseño adaptativo para móviles y desktop

## 📋 Cómo usar la aplicación

### 1. Agregar Jugadores
1. Haz clic en el botón **"Agregar jugadores"**
2. En el formulario que aparece, ingresa:
   - **Nombre** del jugador
   - **Rol** (Arquero, Defensa, Mediocampista o Ataque)
   - **Puntaje general** del 1 al 10 usando el slider
3. Presiona **"Agregar"** para añadir el jugador a la lista
4. Repite el proceso para todos los jugadores

### 2. Generar Equipos
1. Una vez que tengas una cantidad **par** de jugadores en la lista
2. Haz clic en **"Armar los equipos"**
3. La aplicación generará automáticamente 3 opciones de equipos balanceados

### 3. Ver Resultados
- Cada opción muestra:
  - **Equipo A** y **Equipo B** con los jugadores asignados
  - **Diferencia de nivel**: Qué tan equilibrados están los equipos en habilidades
  - **Balance de roles**: Qué tan bien distribuidas están las posiciones
  - Contador de jugadores por rol en cada equipo
- Puedes **"Mostrar puntajes"** para ver el nivel de cada jugador
- Las opciones están ordenadas de mejor a peor balance

### 💡 Consejos de Uso
- Necesitas un número **par** de jugadores (2, 4, 6, 8, etc.)
- Asigna roles coherentes para obtener mejor balance de posiciones
- Las puntaciones más precisas darán equipos mejor equilibrados
- La primera opción suele ser la más balanceada

---

## 👨‍💻 Para Desarrolladores

### Stack Tecnológico
- **Framework**: Next.js 15.1.7 (React 19)
- **Lenguaje**: TypeScript
- **Estilos**: TailwindCSS + shadcn/ui
- **UI Components**: Radix UI
- **Build**: Turbopack (Next.js)

### Estructura del Proyecto

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Página principal (landing)
│   ├── teams2/page.tsx    # Página de armado de equipos
│   ├── layout.tsx         # Layout principal
│   └── globals.css        # Estilos globales
├── components/            # Componentes React
│   ├── PopoverTeamsSimple.tsx      # Contenedor principal
│   ├── PlayerInputFormSimple.tsx   # Formulario de jugadores
│   ├── TeamShufflerSimple.tsx      # Lógica y UI de equipos
│   ├── PlayerCard.tsx              # Card de jugador
│   └── ui/                         # Componentes shadcn/ui
├── types/
│   └── index.ts           # Definiciones de TypeScript
└── lib/
    └── utils.ts           # Utilidades (cn, etc.)
```

### Arquitectura y Funcionamiento

#### 1. **Tipos de Datos** (`src/types/index.ts`)
```typescript
interface SimplePlayer {
  name: string;
  overall: number;  // Nivel del 1-10
  role?: string;    // Rol/posición opcional
}
```

#### 2. **Flujo de la Aplicación**

**a) Entrada de Datos** (`PlayerInputFormSimple.tsx`)
- Formulario controlado con React hooks (`useState`)
- Validación de nombre requerido
- Selector de roles predefinidos (Radix UI Select)
- Slider para puntaje (1-10)

**b) Gestión de Estado** (`PopoverTeamsSimple.tsx`)
- Estado global de lista de jugadores: `playerList`
- Validaciones:
  - Al menos 1 jugador para agregar
  - Número par de jugadores para armar equipos
- Toasts para feedback de errores (usando shadcn/ui)

**c) Algoritmo de Balanceo** (`TeamShufflerSimple.tsx`)

El algoritmo utiliza múltiples métricas para crear equipos equilibrados:

**Métricas de Balance:**
1. **Score Difference** (Diferencia de nivel):
   ```typescript
   scoreDifference = |avg(teamA) - avg(teamB)|
   ```
   - Calcula el promedio de `overall` de cada equipo
   - Busca minimizar la diferencia entre promedios

2. **Role Balance** (Balance de roles):
   ```typescript
   roleBalance = Σ |count(roleA) - count(roleB)|
   ```
   - Cuenta jugadores por rol en cada equipo
   - Suma las diferencias absolutas por rol
   - 0 = balance perfecto, >0 = desbalance

**Proceso del Algoritmo:**

```typescript
generateBalancedTeams(playerState, maxAttempts = 200)
```

1. **Generación de Variantes**:
   - Realiza 200 intentos aleatorios
   - En cada intento:
     - Baraja jugadores aleatoriamente
     - Divide en dos equipos (mitad y mitad)
     - Calcula `scoreDifference` y `roleBalance`

2. **Scoring Combinado**:
   ```typescript
   combinedScore = scoreDifference + (roleBalance * 2)
   ```
   - El balance de roles tiene el doble de peso
   - Prioriza distribuir posiciones equilibradamente

3. **Selección del Mejor**:
   - Guarda el arreglo con menor `combinedScore`
   - Detención anticipada si encuentra balance perfecto (0,0)

4. **Generación Múltiple**:
   - Crea 3 opciones diferentes usando el algoritmo
   - Evita duplicados comparando claves únicas
   - Ordena por calidad de balance

**Visualización** (`TeamShufflerSimple.tsx`):
- Muestra 3 opciones de equipos ordenadas
- Indicadores visuales de calidad:
  - Verde: Balance perfecto/excelente
  - Naranja: Balance bueno
  - Rojo: Balance regular
- Toggle para mostrar/ocultar puntajes
- Conteo de roles por equipo

### 3. **Componentes UI Reutilizables**

La app usa **shadcn/ui** (componentes basados en Radix UI):
- `Button`: Botones estilizados
- `Card`: Contenedores de contenido
- `Input`: Campos de texto
- `Slider`: Control de rango
- `Select`: Dropdown de selección
- `Popover`: Modal/dropdown de formulario
- `Toast`: Notificaciones

### Instalación y Desarrollo

```bash
# Instalar dependencias
npm install

# Modo desarrollo
npm run dev

# Build para producción
npm run build

# Iniciar en producción
npm start
```

La aplicación estará disponible en `http://localhost:3000`

### Posibles Mejoras

1. **Persistencia**: Guardar jugadores en localStorage
2. **Historial**: Registro de equipos anteriores
3. **Exportar**: Generar PDF o imagen de equipos
4. **Más roles**: Permitir roles personalizados
5. **Estadísticas**: Tracking de victorias por equipo
6. **Habilidades múltiples**: Volver a la versión compleja con velocidad, técnica, resistencia, trabajo en equipo
7. **Optimización**: Web Workers para cálculos pesados con muchos jugadores

### Testing

Actualmente el proyecto no incluye tests. Se recomienda agregar:
- **Unit tests**: Vitest para funciones de balance
- **Component tests**: React Testing Library
- **E2E tests**: Playwright o Cypress

---

## 📄 Licencia

Este proyecto es de uso libre para eventos deportivos y recreativos.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor abre un issue o pull request para sugerencias o mejoras.
