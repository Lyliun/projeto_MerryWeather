import { Router, Request, Response } from 'express';
import { weatherService } from '../services/weather.service'

const router = Router();

/**
 * @route   GET /api/weather/search/coords
 * @desc    Obtém clima baseado em latitude e longitude (Geolocalização)
 * ATENÇÃO: Esta rota deve vir ANTES de /:city
 */
router.get('/search/coords', async (req: Request, res: Response) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ 
      success: false, 
      message: 'Latitude e Longitude são obrigatórias para esta busca.' 
    });
  }

  try {
    // Chamando o método de coordenadas no seu service
    const data = await weatherService.getWeatherByCoords(Number(lat), Number(lon));

    return res.status(200).json({
      success: true,
      data
    });
  } catch (error: any) {
    console.error('Erro na busca por coordenadas:', error.message);
    return res.status(500).json({ 
      success: false, 
      message: 'Erro ao processar clima por geolocalização.' 
    });
  }
});

/**
 * @route   GET /api/weather/:city
 * @desc    Obtém clima atual e previsão de 7 dias para uma cidade
 */
router.get('/:city', async (req: Request, res: Response) => {
  const { city } = req.params;

  if (!city || city.trim().length < 2) {
    return res.status(400).json({ 
      success: false, 
      message: 'Um nome de cidade válido deve ser fornecido.' 
    });
  }

  try {
    const data = await weatherService.getWeather(city);
    return res.status(200).json({ success: true, data });

  } catch (error: any) {
    const errorMessage = error.message || 'Erro interno no servidor';
    
    if (errorMessage.includes('não encontrada')) {
      return res.status(404).json({ success: false, message: errorMessage });
    }

    if (errorMessage.includes('Timeout') || errorMessage.includes('Muitas requisições')) {
      return res.status(503).json({ success: false, message: errorMessage });
    }

    return res.status(500).json({ 
      success: false, 
      message: 'Erro ao processar sua solicitação de clima.' 
    });
  }
});

/**
 * @route   GET /api/weather/debug/info
 * @desc    Retorna informações técnicas sobre o serviço e cache
 */
router.get('/debug/info', (_req: Request, res: Response) => {
  const info = weatherService.getServiceInfo();
  return res.status(200).json(info);
});

export default router;