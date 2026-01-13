import { getMecanicos, getMecanicoById, createMecanico, updateMecanico, deleteMecanico } from '../controllers/mecanicosControllers'
import { Router } from 'express';
const router = Router();

router.get('/', getMecanicos);
router.get('/:id', getMecanicoById);
router.post('/', createMecanico);
router.put('/:id', updateMecanico);
router.delete('/:id', deleteMecanico);

export default router;