export type ResourceType = "pdf" | "video" | "image" | "document" | "link" | "other";

const resourceTypePatterns: { type: ResourceType; patterns: RegExp[] }[] = [
  {
    type: "pdf",
    patterns: [/\.pdf$/i, /pdf/i],
  },
  {
    type: "video",
    patterns: [/\.(mp4|webm|ogg|mov|avi)$/i, /youtube\.com|youtu\.be|vimeo\.com/i, /video/i],
  },
  {
    type: "image",
    patterns: [/\.(jpg|jpeg|png|gif|svg|webp)$/i, /image/i],
  },
  {
    type: "document",
    patterns: [/\.(doc|docx|xls|xlsx|ppt|pptx)$/i, /document/i, /spreadsheet/i, /presentation/i],
  },
];

export function detectResourceType(url: string): ResourceType {
  const lowerUrl = url.toLowerCase();

  for (const { type, patterns } of resourceTypePatterns) {
    for (const pattern of patterns) {
      if (pattern.test(lowerUrl)) {
        return type;
      }
    }
  }

  if (lowerUrl.startsWith("http://") || lowerUrl.startsWith("https://")) {
    return "link";
  }

  return "other";
}

export function getResourceIcon(type: ResourceType): string {
  const icons: Record<ResourceType, string> = {
    pdf: "📄",
    video: "🎥",
    image: "🖼️",
    document: "📝",
    link: "🔗",
    other: "📎",
  };
  return icons[type];
}

export function getResourceTypeLabel(type: ResourceType): string {
  const labels: Record<ResourceType, string> = {
    pdf: "PDF",
    video: "Video",
    image: "Imagen",
    document: "Documento",
    link: "Enlace",
    other: "Archivo",
  };
  return labels[type];
}
