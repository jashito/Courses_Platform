# Assets - Courses Platform

## Estructura

```
public/assets/
├── icons/
│   ├── sidebar/      # Iconos para navegación (24px, line style)
│   ├── features/     # Iconos para features (48px, filled)
│   └── ui/          # Iconos UI (botones, inputs, etc)
├── illustrations/
│   ├── hero/        # Ilustraciones para hero section
│   ├── features/    # Ilustraciones para features
│   └── empty/      # Estados vacíos
└── images/
    ├── courses/     # Imágenes de cursos
    └── users/       # Avatares, perfil
```

## Convenciones de nombres

### Iconos
- Formato: `kebab-case`
- Ejemplos:
  - `home.svg`
  - `courses.svg`
  - `user-profile.svg`
  - `check-circle.svg`
  - `arrow-right.svg`

### Ilustraciones
- Formato: `kebab-case`
- Ejemplos:
  - `hero-learning.svg`
  - `empty-courses.svg`
  - `success-state.svg`

## Especificaciones técnicas

### Iconos SVG
- **sidebar**: 24x24px, stroke-width: 1.5
- **features**: 48x48px, filled o stroke-width: 2
- **ui**: 20x20px, stroke-width: 1.5
- Color: Usar `currentColor` para permitir CSS theming
- Optimizar con SVGO antes de guardar

### Ilustraciones SVG
- Tamaño máximo: 600x400px
- Color: Usar tokens CSS (`var(--primary)`, etc.)
- Exportar desde Figma/Illustrator como SVG optimizado

## Fuentes recomendadas (Icons8)

- **Line DX**: Iconos line minimalistas
- **Windows 11**: Iconos filled
- **Happy**: Ilustraciones de personas
- **Dusk**: Ilustraciones moderno/corporativo

## Instalación desde Icons8

1. Descargar en formato **SVG**
2. Optimizar con [SVGOMG](https://jakearchibald.github.io/svgomg/)
3. Renombrar según convención
4. Guardar en carpeta对应
5. Actualizar código para usar el nuevo icono
