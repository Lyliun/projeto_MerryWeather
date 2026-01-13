import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import weatherRoutes from './routes/weatherRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Log de requisições - Removido 'next' se não for manipular fluxo específico além do log
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Routes
app.use('/api/weather', weatherRoutes);

// Health check - 'req' não é usado, então prefixamos com '_'
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'OK',
    message: 'Weather API is running',
    timestamp: new Date().toISOString(),
  });
});

// 404 handler - 'next' removido por ser o último middleware de fluxo normal
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Rota não encontrada',
    path: req.path
  });
});

// Error handler - 'req' e 'next' prefixados com '_' para satisfazer o compilador
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('❌ Server Error:', err.stack);
  res.status(500).json({
    success: false,
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server: http://localhost:${PORT}`);
});
