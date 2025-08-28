# UI Forge Studio: Visual React Editor — Agent Instructions

## Project Overview

UI Forge Studio is a production-ready, full-stack visual UI designer that empowers designers and developers to create stunning, high-performance web applications. Think Figma meets VS Code - a sophisticated drag-and-drop interface with real-time code generation.

## Core Features & Architecture

- **Visual Canvas**: Drag-and-drop interface with precision positioning and layout controls
- **Real-Time Code Generation**: Instant HTML/CSS, Tailwind CSS, and React JSX output
- **Component Library**: Rich, pre-built customizable UI components
- **Responsive Design Tools**: Multi-breakpoint editing with live preview
- **Code Export**: Clean, production-ready code output

## Advanced Features

- **AI-Powered Design Assistant**: GPT integration for layout suggestions, component recommendations, and code optimization
- **Animation Studio**: Timeline-based animations with Framer Motion integration and CSS keyframes
- **Theme System**: Dynamic theming with CSS variables, dark/light modes, and brand customization
- **Design Tokens**: Centralized design system with typography, spacing, colors, and component variants
- **Version Control**: Git-like versioning for designs with branching, merging, and history
- **Real-Time Collaboration**: Multi-user editing with live cursors, comments, and change tracking
- **Advanced Interactions**: Hover states, micro-interactions, and conditional logic
- **Data Binding**: Connect components to APIs, mock data, or CMS content
- **Plugin System**: Extensible architecture for custom components and integrations
- **Performance Analytics**: Bundle size analysis, accessibility scoring, and performance metrics
- **Design System Generator**: Auto-generate Storybook documentation and component libraries
- **Advanced Export Options**: Figma plugin, VS Code extension, npm package publishing

## Tech Stack (Advanced)

- **Frontend**: Next.js 14 (App Router) + React 18 + TypeScript
- **UI Framework**: Tailwind CSS + Headless UI/Radix UI primitives
- **Drag & Drop**: @dnd-kit/core + @dnd-kit/sortable for advanced interactions
- **Canvas Engine**: React Flow or custom canvas with Konva.js/Fabric.js
- **Code Generation**: Abstract Syntax Tree (AST) manipulation with Babel/TypeScript compiler
- **State Management**: Zustand for canvas state + React Query for persistence
- **Styling**: CSS-in-JS (styled-components) or Tailwind with dynamic class generation
- **Database**: Supabase/PlanetScale for project storage + real-time collaboration
- **AI Integration**: OpenAI API for design assistance and code optimization
- **Animation**: Framer Motion + Lottie for advanced animations
- **Real-time**: Socket.io or Supabase Realtime for live collaboration
- **Version Control**: Custom Git-like system with conflict resolution
- **Performance**: Webpack Bundle Analyzer, Lighthouse CI integration
- **Testing**: Vitest + Testing Library + Playwright for E2E
- **Deployment**: Vercel Edge Functions + CDN for global performance

## Key Files & Directory Structure

```
ui-forge-studio/
├── app/
│   ├── editor/[projectId]/page.tsx     # Main editor interface
│   ├── dashboard/page.tsx              # Project management
│   ├── collaboration/page.tsx          # Team workspace
│   ├── marketplace/page.tsx            # Component marketplace
│   └── api/
│       ├── projects/route.ts           # Project CRUD
│       ├── codegen/route.ts            # Code generation endpoint
│       ├── ai/route.ts                 # AI design assistant
│       ├── collaboration/route.ts      # Real-time sync
│       └── analytics/route.ts          # Performance metrics
├── components/
│   ├── editor/
│   │   ├── Canvas.tsx                  # Main design canvas
│   │   ├── Toolbar.tsx                 # Design tools & properties
│   │   ├── ComponentPalette.tsx        # Drag source for components
│   │   ├── LayersPanel.tsx             # Component hierarchy
│   │   ├── CodePreview.tsx             # Live code output
│   │   ├── AnimationTimeline.tsx       # Animation editor
│   │   ├── ThemeEditor.tsx             # Theme customization
│   │   ├── VersionHistory.tsx          # Git-like version control
│   │   ├── AIAssistant.tsx             # AI-powered suggestions
│   │   └── CollaborationLayer.tsx      # Multi-user features
│   ├── ui/                             # Base UI components
│   ├── layout/                         # Layout components
│   └── marketplace/                    # Component marketplace
├── lib/
│   ├── canvas/
│   │   ├── engine.ts                   # Canvas interaction logic
│   │   ├── renderer.ts                 # Component rendering
│   │   ├── serializer.ts               # Canvas state serialization
│   │   └── constraints.ts              # Layout constraints & snapping
│   ├── codegen/
│   │   ├── react-generator.ts          # JSX generation
│   │   ├── css-generator.ts            # CSS/Tailwind generation
│   │   ├── html-generator.ts           # HTML generation
│   │   ├── vue-generator.ts            # Vue SFC generation
│   │   └── optimization.ts             # Code optimization
│   ├── ai/
│   │   ├── design-assistant.ts         # AI design suggestions
│   │   ├── code-optimizer.ts           # AI code improvements
│   │   └── accessibility-checker.ts    # AI accessibility audits
│   ├── animation/
│   │   ├── timeline.ts                 # Animation timeline logic
│   │   ├── keyframes.ts                # CSS keyframe generation
│   │   └── motion-presets.ts           # Framer Motion presets
│   ├── collaboration/
│   │   ├── websocket.ts                # Real-time sync
│   │   ├── conflict-resolution.ts      # Merge conflict handling
│   │   └── permissions.ts              # Access control
│   ├── versioning/
│   │   ├── git-like.ts                 # Version control system
│   │   ├── branching.ts                # Design branching
│   │   └── history.ts                  # Change tracking
│   ├── theme/
│   │   ├── system.ts                   # Design token system
│   │   ├── generator.ts                # Theme generation
│   │   └── css-variables.ts            # CSS custom properties
│   ├── components/
│   │   ├── registry.ts                 # Component definitions
│   │   ├── templates.ts                # Component templates
│   │   ├── marketplace.ts              # External components
│   │   └── custom-components.ts        # User-defined components
│   ├── performance/
│   │   ├── analyzer.ts                 # Bundle analysis
│   │   ├── metrics.ts                  # Performance tracking
│   │   └── optimization.ts             # Auto-optimization
│   ├── plugins/
│   │   ├── system.ts                   # Plugin architecture
│   │   ├── figma-sync.ts               # Figma integration
│   │   └── cms-connectors.ts           # CMS integrations
│   └── types/
│       ├── canvas.ts                   # Canvas element types
│       ├── codegen.ts                  # Code generation types
│       ├── animation.ts                # Animation types
│       ├── theme.ts                    # Theme system types
│       └── collaboration.ts            # Multi-user types
├── hooks/
│   ├── useCanvas.ts                    # Canvas state management
│   ├── useCodeGen.ts                   # Code generation hooks
│   ├── useDragDrop.ts                  # Drag & drop logic
│   ├── useAnimation.ts                 # Animation timeline hooks
│   ├── useCollaboration.ts             # Real-time sync hooks
│   ├── useVersioning.ts                # Version control hooks
│   ├── useAI.ts                        # AI assistant hooks
│   ├── useTheme.ts                     # Theme system hooks
│   └── usePerformance.ts               # Performance monitoring
├── plugins/
│   ├── figma/                          # Figma plugin source
│   ├── vscode/                         # VS Code extension
│   └── storybook/                      # Storybook integration
├── styles/
│   ├── editor.css                      # Editor-specific styles
│   ├── themes/                         # Built-in themes
│   └── animations.css                  # Animation definitions
└── workers/
    ├── codegen.worker.ts               # Background code generation
    ├── performance.worker.ts           # Performance analysis
    └── ai.worker.ts                    # AI processing
```

## Agent Custom Rules (MANDATORY)

### Pre-scan & Quick-fix Protocol

Before any implementation:

1. **Dependency Check**: Verify Next.js, React, TypeScript, Tailwind are properly configured
2. **Build Validation**: Run `npm run build` or `npx tsc --noEmit` to catch type errors
3. **Canvas Engine Test**: Ensure drag-drop libraries (@dnd-kit) are installed and functional
4. **Code Gen Test**: Verify AST manipulation tools (Babel parser) work correctly

### Phased Implementation Map

**Phase 1 — Foundation & Canvas**

- Set up Next.js + TypeScript + Tailwind configuration
- Install canvas dependencies (@dnd-kit, react-flow or konva)
- Create basic Canvas component with drag-drop zones
- Implement simple element positioning and selection

**Phase 2 — Component System & Code Generation**

- Build component registry with basic elements (div, button, input, text)
- Implement ComponentPalette with draggable component sources
- Add LayersPanel showing component hierarchy
- Create AST-based React JSX generator with syntax highlighting

**Phase 3 — Advanced Canvas Features**

- Add responsive breakpoint editing with live preview
- Implement undo/redo system with command pattern
- Add component copy/paste and duplication
- Create advanced selection tools (multi-select, grouping)

**Phase 4 — AI Integration & Automation**

- Integrate OpenAI API for design suggestions
- Implement AI code optimization and cleanup
- Add accessibility scoring and recommendations
- Create smart layout suggestions and auto-alignment

**Phase 5 — Animation & Interactions**

- Build timeline-based animation editor
- Add Framer Motion integration for complex animations
- Implement hover states and micro-interactions
- Create animation presets and easing functions

**Phase 6 — Theme System & Design Tokens**

- Implement centralized design token system
- Add dynamic theming with CSS variables
- Create theme editor with real-time preview
- Build brand customization tools

**Phase 7 — Collaboration & Version Control**

- Add real-time collaboration with Socket.io
- Implement Git-like versioning system
- Create conflict resolution for simultaneous edits
- Add comments and review system

**Phase 8 — Performance & Analytics**

- Integrate bundle analyzer and performance metrics
- Add accessibility auditing tools
- Implement code splitting recommendations
- Create performance dashboards

**Phase 9 — Plugin System & Marketplace**

- Build extensible plugin architecture
- Create Figma plugin for design import
- Develop VS Code extension for code integration
- Add component marketplace with user contributions

**Phase 10 — Enterprise & Production**

- Add team management and permissions
- Implement advanced export options (npm packages)
- Create Storybook integration
- Add enterprise SSO and compliance features

## Development Patterns

### Canvas State Management

```typescript
// lib/types/canvas.ts
interface CanvasElement {
  id: string;
  type: "div" | "button" | "input" | "text" | "image";
  props: Record<string, any>;
  styles: CSSProperties;
  children: CanvasElement[];
  position: { x: number; y: number };
  size: { width: number; height: number };
}

// hooks/useCanvas.ts
const useCanvas = () => {
  const elements = useCanvasStore((state) => state.elements);
  const selectedId = useCanvasStore((state) => state.selectedId);
  // ... canvas operations
};
```

### Code Generation Pattern

```typescript
// lib/codegen/react-generator.ts
export const generateReactComponent = (elements: CanvasElement[]) => {
  const ast = parseToAST(elements);
  return generateFromAST(ast, { framework: "react", styling: "tailwind" });
};
```

### Component Registry Pattern

```typescript
// lib/components/registry.ts
export const COMPONENT_REGISTRY = {
  button: {
    name: "Button",
    icon: "cursor-pointer",
    defaultProps: {
      children: "Click me",
      className: "px-4 py-2 bg-blue-500 text-white rounded",
    },
    properties: ["children", "onClick", "disabled", "variant"],
  },
  // ... other components
};
```

## Developer Workflow

### Setup Commands

```bash
# Install core dependencies
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
npm install @babel/parser @babel/generator @babel/types
npm install zustand react-query lucide-react framer-motion
npm install socket.io-client @supabase/supabase-js
npm install monaco-editor @monaco-editor/react
npm install fabric konva react-konva

# AI and advanced features
npm install openai @huggingface/inference
npm install lottie-react react-spring
npm install @headlessui/react @radix-ui/react-*

# Performance and analytics
npm install webpack-bundle-analyzer lighthouse
npm install @sentry/nextjs @vercel/analytics

# Development tools
npm install -D @types/babel__generator @types/fabric
npm install -D vitest @testing-library/react playwright
npm install -D eslint-plugin-a11y @typescript-eslint/parser

# Development
npm run dev          # Start dev server
npm run build        # Production build
npm run lint         # ESLint check
npm run test         # Run tests
npm run test:e2e     # Playwright E2E tests
npm run analyze      # Bundle analysis
npm run storybook    # Component documentation
```

### Testing Strategy

- **Unit Tests**: Component registry, code generation functions
- **Integration Tests**: Canvas operations, drag-drop interactions
- **E2E Tests**: Full design-to-code workflow using Playwright
- **Visual Tests**: Canvas rendering and code output validation

## Key Implementation Notes

### Advanced Drag & Drop System

- Use @dnd-kit with custom collision detection for precise positioning
- Implement snap-to-grid, smart guides, and magnetic alignment
- Handle nested component dropping with visual feedback
- Support multi-select drag operations and group transformations

### AI-Powered Features

```typescript
// lib/ai/design-assistant.ts
export const getDesignSuggestions = async (context: CanvasElement[]) => {
  const prompt = `Analyze this UI layout: ${JSON.stringify(
    context
  )}. Suggest improvements for UX, accessibility, and visual hierarchy.`;
  return await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
  });
};

// Auto-optimize generated code
export const optimizeCode = async (code: string) => {
  return await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content:
          "You are a code optimizer. Clean up this React component for performance and best practices.",
      },
      {
        role: "user",
        content: code,
      },
    ],
  });
};
```

### Advanced Code Generation

- Generate clean, readable code with proper indentation and comments
- Support multiple frameworks (React, Vue, Angular, Svelte)
- Output production-ready Tailwind classes with design tokens
- Include TypeScript interfaces and prop validation
- Generate Storybook stories and tests automatically

### Real-Time Collaboration System

```typescript
// lib/collaboration/websocket.ts
export class CollaborationEngine {
  private socket: Socket;
  private operationalTransform: OT;

  syncCanvasChange(change: CanvasChange) {
    const transformedChange = this.operationalTransform.transform(change);
    this.socket.emit("canvas:update", transformedChange);
  }

  handleConflict(localChange: CanvasChange, remoteChange: CanvasChange) {
    return this.operationalTransform.resolve(localChange, remoteChange);
  }
}
```

### Animation Timeline System

- Visual timeline editor similar to After Effects
- Keyframe-based animations with easing functions
- Layer-based animation composition
- Export to Framer Motion, CSS animations, or Lottie JSON

### Performance Optimization Engine

- Real-time bundle size analysis during design
- Automated code splitting suggestions
- Image optimization and format recommendations
- Accessibility scoring with automated fixes
- Performance budgets and alerts

### Plugin Architecture

```typescript
// lib/plugins/system.ts
interface UIForgePlugin {
  name: string;
  version: string;
  components?: ComponentDefinition[];
  codeGenerators?: CodeGenerator[];
  tools?: ToolDefinition[];
  onInstall?: () => void;
  onUninstall?: () => void;
}

export const registerPlugin = (plugin: UIForgePlugin) => {
  // Plugin registration logic
};
```

### Performance Considerations

- Virtualize large component trees in LayersPanel
- Debounce code generation during active editing
- Use React.memo for canvas elements to prevent unnecessary re-renders
- Implement canvas viewport culling for large designs

## Advanced Enterprise Features

### Team Collaboration & Management

- **Multi-user Workspaces**: Team accounts with role-based permissions
- **Design Systems**: Shared component libraries across organization
- **Brand Guidelines**: Automated brand compliance checking
- **Review Workflows**: Approval processes for design changes
- **Activity Tracking**: Detailed audit logs for enterprise compliance

### Developer Integration Tools

- **CLI Tool**: Command-line interface for CI/CD integration
- **API Access**: RESTful API for programmatic design operations
- **Webhook Support**: Real-time notifications for external systems
- **Git Integration**: Direct push to repositories with PR creation
- **Component Publishing**: NPM package generation and publishing

### Advanced Export & Integration

- **Framework Support**: React, Vue, Angular, Svelte, and vanilla HTML
- **CMS Integration**: WordPress, Contentful, Strapi connectors
- **E-commerce**: Shopify, WooCommerce theme generation
- **Mobile Export**: React Native component generation
- **Email Templates**: Responsive email HTML generation

### AI-Powered Automation

- **Design Audits**: Automated UX/UI analysis with recommendations
- **A/B Test Generation**: Automatic variant creation for testing
- **Content Generation**: AI-generated placeholder content and copy
- **Accessibility Fixes**: Automated WCAG compliance improvements
- **Performance Optimization**: Smart code optimization suggestions

### Security & Compliance

- **Enterprise SSO**: SAML, OAuth, Active Directory integration
- **Data Encryption**: End-to-end encryption for sensitive designs
- **Compliance Reports**: GDPR, SOC 2, HIPAA compliance tracking
- **Backup & Recovery**: Automated backups with point-in-time restore
- **Audit Trails**: Comprehensive logging for security reviews

## Success Criteria & Milestones

### Core Functionality ✓

- Drag any component from palette to canvas with pixel-perfect positioning
- Edit properties in real-time with immediate visual feedback
- Generate clean React JSX + Tailwind CSS code with proper formatting
- Export working, production-ready components with TypeScript
- Responsive design preview across all breakpoints (mobile, tablet, desktop)

### Advanced Features ✓

- AI design assistant providing contextual suggestions and optimizations
- Timeline-based animation editor with Framer Motion export
- Real-time collaboration with conflict resolution and live cursors
- Git-like version control with branching and merging capabilities
- Dynamic theming system with design tokens and CSS variables
- Performance analytics with bundle size and accessibility scoring

### Enterprise Ready ✓

- Plugin marketplace with third-party integrations (Figma, Sketch, Adobe XD)
- Team workspaces with role-based permissions and approval workflows
- Advanced export options (npm packages, Storybook, email templates)
- Enterprise SSO and compliance features (GDPR, SOC 2)
- API access for CI/CD integration and automated workflows

### Performance Benchmarks

- Canvas operations under 16ms for 60fps interactions
- Code generation under 100ms for medium complexity components
- Real-time collaboration latency under 50ms
- Bundle size optimization suggestions within 5% accuracy
- Accessibility scoring with 95%+ WCAG compliance detection

---

**UI Forge Studio represents the next evolution of visual design tools** - combining the intuitive design experience of Figma with the code generation capabilities of GitHub Copilot, all while maintaining enterprise-grade performance and collaboration features. Start with the foundation and build incrementally toward this comprehensive vision.
