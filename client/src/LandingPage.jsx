import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./LandingPage.css";

export default function LandingPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [visibleTasks, setVisibleTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [typingTasks, setTypingTasks] = useState([]);
  const [typingText, setTypingText] = useState({});
  const [showCompleteMessage, setShowCompleteMessage] = useState(false);

  // Obtener las tareas traducidas
  const DEMO_TASKS = t("landing.demoTasks", { returnObjects: true }).map(
    (text, index) => ({
      id: index + 1,
      text,
      delay: index * 3000,
    })
  );

  useEffect(() => {
    const timers = [];
    let taskIndex = 0;

    const animateTask = (task) => {
      // Mostrar tarea en modo edición (typing)
      const showTypingTimer = setTimeout(() => {
        setTypingTasks((prev) => [...prev, task.id]);
        setVisibleTasks((prev) => [...prev, task.id]);
      }, task.delay);
      timers.push(showTypingTimer);

      // Simular escritura letra por letra
      const chars = task.text.split("");
      chars.forEach((char, charIndex) => {
        const typeCharTimer = setTimeout(() => {
          setTypingText((prev) => ({
            ...prev,
            [task.id]: task.text.substring(0, charIndex + 1),
          }));
        }, task.delay + 200 + charIndex * 50);
        timers.push(typeCharTimer);
      });

      // Terminar de escribir (salir del modo edición)
      const finishTypingTimer = setTimeout(() => {
        setTypingTasks((prev) => prev.filter((id) => id !== task.id));
      }, task.delay + 200 + chars.length * 50 + 300);
      timers.push(finishTypingTimer);

      // Completar tarea después de un momento
      const completeTimer = setTimeout(() => {
        setCompletedTasks((prev) => {
          const newCompleted = [...prev, task.id];
          // Si todas las tareas están completadas, mostrar mensaje
          if (newCompleted.length === DEMO_TASKS.length) {
            setTimeout(() => {
              setShowCompleteMessage(true);
            }, 500);
          }
          return newCompleted;
        });
      }, task.delay + 200 + chars.length * 50 + 1500);
      timers.push(completeTimer);
    };

    // Animar todas las tareas
    DEMO_TASKS.forEach((task) => {
      animateTask(task);
    });

    // Reiniciar animación
    const totalDuration = DEMO_TASKS[DEMO_TASKS.length - 1].delay + 5000;
    const resetTimer = setTimeout(() => {
      setVisibleTasks([]);
      setCompletedTasks([]);
      setTypingTasks([]);
      setTypingText({});
      setShowCompleteMessage(false);
    }, totalDuration);
    timers.push(resetTimer);

    // Bucle infinito
    const loopInterval = setInterval(() => {
      setVisibleTasks([]);
      setCompletedTasks([]);
      setTypingTasks([]);
      setTypingText({});
      setShowCompleteMessage(false);

      DEMO_TASKS.forEach((task) => {
        animateTask(task);
      });
    }, totalDuration + 1000);

    return () => {
      timers.forEach(clearTimeout);
      clearInterval(loopInterval);
    };
  }, []);

  return (
    <div className="landing-page">
      {/* Header */}
      <header className="landing-header">
        <div className="landing-container">
          <div className="footer-logo">
            <img src="/logo.png" alt="FlickDo" className="footer-logo-image" />
            <span className="logo-text">FlickDo</span>
          </div>
          <button className="btn-login" onClick={() => navigate("/login")}>
            {t("landing.header.login")}
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="landing-container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                {t("landing.hero.title")}
                <span className="gradient-text">
                  {t("landing.hero.titleGradient")}
                </span>
              </h1>
              <p className="hero-description">
                {t("landing.hero.description")}
              </p>
              <div className="hero-buttons">
                <button
                  className="btn-primary"
                  onClick={() => navigate("/login")}
                >
                  {t("landing.hero.startFree")}
                </button>
                <a
                  href="https://github.com/rub3nnn/FlickDo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    style={{
                      width: "20px",
                      height: "20px",
                      marginRight: "8px",
                    }}
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  {t("landing.hero.viewGithub")}
                </a>
              </div>
            </div>

            {/* Demo de tareas animadas */}
            <div className="hero-demo">
              <div className="demo-container">
                <div className="demo-header">
                  <div className="demo-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <span className="demo-title">
                    {t("landing.hero.demoTitle")}
                  </span>
                </div>
                <div className="demo-tasks">
                  {showCompleteMessage ? (
                    <div className="complete-message">
                      <div className="complete-icon">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                        >
                          <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                          <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                      </div>
                      <h3>{t("landing.complete.title")}</h3>
                      <p>{t("landing.complete.message")}</p>
                    </div>
                  ) : (
                    DEMO_TASKS.map((task) => {
                      const isVisible = visibleTasks.includes(task.id);
                      const isCompleted = completedTasks.includes(task.id);
                      const isTyping = typingTasks.includes(task.id);
                      const currentText = typingText[task.id] || "";

                      if (!isVisible) return null;

                      return (
                        <div
                          key={task.id}
                          className={`demo-task ${
                            isCompleted ? "completed" : ""
                          } ${isTyping ? "typing" : ""}`}
                        >
                          <button className="demo-task-checkbox">
                            {isCompleted ? (
                              <svg
                                className="demo-check-icon checked"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                stroke="none"
                              >
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                              </svg>
                            ) : (
                              <svg
                                className="demo-check-icon unchecked"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <circle cx="12" cy="12" r="10" />
                              </svg>
                            )}
                          </button>
                          <span className="demo-task-text">
                            {isTyping ? (
                              <>
                                {currentText}
                                <span className="typing-cursor">|</span>
                              </>
                            ) : (
                              task.text
                            )}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="landing-container">
          <h2 className="section-title">{t("landing.features.title")}</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M9 11l3 3L22 4" />
                  <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                </svg>
              </div>
              <h3 className="feature-title">
                {t("landing.features.taskManagement.title")}
              </h3>
              <p className="feature-description">
                {t("landing.features.taskManagement.description")}
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 00-3-3.87" />
                  <path d="M16 3.13a4 4 0 010 7.75" />
                </svg>
              </div>
              <h3 className="feature-title">
                {t("landing.features.collaboration.title")}
              </h3>
              <p className="feature-description">
                {t("landing.features.collaboration.description")}
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <h3 className="feature-title">
                {t("landing.features.multipleLists.title")}
              </h3>
              <p className="feature-description">
                {t("landing.features.multipleLists.description")}
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <line x1="12" y1="1" x2="12" y2="23" />
                  <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
                </svg>
              </div>
              <h3 className="feature-title">
                {t("landing.features.tags.title")}
              </h3>
              <p className="feature-description">
                {t("landing.features.tags.description")}
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                  <line x1="12" y1="22.08" x2="12" y2="12" />
                </svg>
              </div>
              <h3 className="feature-title">
                {t("landing.features.statistics.title")}
              </h3>
              <p className="feature-description">
                {t("landing.features.statistics.description")}
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 1a3 3 0 003 3 3 3 0 003-3 3 3 0 00-3-3 3 3 0 00-3 3z" />
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h3 className="feature-title">
                {t("landing.features.openSource.title")}
              </h3>
              <p className="feature-description">
                {t("landing.features.openSource.description")}
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
              </div>
              <h3 className="feature-title">
                {t("landing.features.navigation.title")}
              </h3>
              <p className="feature-description">
                {t("landing.features.navigation.description")}
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                </svg>
              </div>
              <h3 className="feature-title">
                {t("landing.features.darkMode.title")}
              </h3>
              <p className="feature-description">
                {t("landing.features.darkMode.description")}
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="18" cy="18" r="3" />
                  <circle cx="6" cy="6" r="3" />
                  <path d="M13 6h3a2 2 0 012 2v7" />
                  <path d="M6 9v12" />
                </svg>
              </div>
              <h3 className="feature-title">
                {t("landing.features.integrations.title")}
              </h3>
              <p className="feature-description">
                {t("landing.features.integrations.description")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Open Source Section */}
      <section className="opensource-section">
        <div className="landing-container">
          <div className="opensource-content">
            <div className="opensource-badge">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              <span>{t("landing.opensource.badge")}</span>
            </div>
            <h2 className="opensource-title">
              {t("landing.opensource.title")}
            </h2>
            <p className="opensource-description">
              {t("landing.opensource.description")}{" "}
              <a
                href="https://rub3n.es"
                target="_blank"
                rel="noopener noreferrer"
                className="opensource-link"
              >
                @rub3nnn
              </a>
              {t("landing.opensource.description2")}
            </p>
            <div className="opensource-stats">
              <div className="stat-item">
                <div className="stat-number">100%</div>
                <div className="stat-label">
                  {t("landing.opensource.stats.free")}
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-number">Open</div>
                <div className="stat-label">
                  {t("landing.opensource.stats.openSource")}
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-number">∞</div>
                <div className="stat-label">
                  {t("landing.opensource.stats.tasks")}
                </div>
              </div>
            </div>
            <div className="opensource-buttons">
              <a
                href="https://github.com/rub3nnn/FlickDo"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  style={{ width: "20px", height: "20px", marginRight: "8px" }}
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                {t("landing.opensource.viewRepo")}
              </a>
              <a
                href="https://rub3n.es"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                {t("landing.opensource.portfolio")}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="landing-container">
          <div className="cta-content">
            <h2 className="cta-title">{t("landing.cta.title")}</h2>
            <p className="cta-description">{t("landing.cta.description")}</p>
            <button
              className="btn-primary btn-large"
              onClick={() => navigate("/login")}
            >
              {t("landing.cta.button")}
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="landing-container">
          <div className="footer-content">
            <div className="footer-logo">
              <img
                src="/logo.png"
                alt="FlickDo"
                className="footer-logo-image"
              />
              <span className="logo-text">FlickDo</span>
            </div>
            <p className="footer-text">
              © 2025 FlickDo. {t("landing.footer.copyright")}{" "}
              <a
                href="https://github.com/rub3nnn"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "var(--primary-color)",
                  textDecoration: "none",
                }}
              >
                @rub3nnn
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
