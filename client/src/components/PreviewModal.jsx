import { useState, useEffect } from "react";
import { X, Github, ExternalLink, Info } from "lucide-react";

export function PreviewModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Mostrar el modal solo si no se ha mostrado antes en esta sesión
    const hasSeenModal = sessionStorage.getItem("hasSeenPreviewModal");
    if (!hasSeenModal) {
      setIsOpen(true);
      sessionStorage.setItem("hasSeenPreviewModal", "true");
    }
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-lg mx-4 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Header con gradiente */}
        <div className="bg-linear-to-r from-indigo-600 to-purple-600 p-6 text-white">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/20 rounded-lg">
              <Info className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold">Modo Preview</h2>
          </div>
          <p className="text-indigo-100 text-sm">
            Versión de demostración de FlickDo
          </p>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              ¡Bienvenido a FlickDo Preview! 👋
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Esta es una versión de demostración que funciona sin base de
              datos. Todos los datos son ejemplos y los cambios se guardan solo
              en tu navegador durante esta sesión.
            </p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Características disponibles:
            </h4>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>✓ Gestión completa de tareas y listas</li>
              <li>✓ Sistema de etiquetas y prioridades</li>
              <li>✓ Estadísticas y visualización de progreso</li>
              <li>✓ Interfaz completa de usuario</li>
            </ul>
          </div>

          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-amber-900 dark:text-amber-100 mb-2">
              Limitaciones del preview:
            </h4>
            <ul className="text-sm text-amber-800 dark:text-amber-200 space-y-1">
              <li>• Los datos no se persisten al recargar</li>
              <li>• No hay autenticación real</li>
              <li>• Funcionalidades colaborativas deshabilitadas</li>
            </ul>
          </div>

          {/* Links de acción */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <a
              href="https://github.com/rub3nnn/FlickDo"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors font-medium text-sm"
            >
              <Github className="w-4 h-4" />
              Ver en GitHub
            </a>
            <button
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm"
            >
              <ExternalLink className="w-4 h-4" />
              Explorar Preview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
