const express = require('express')
const router = express.Router({ mergeParams: true })

router.get('/:userId', async (req, res) => {})
router.post('/', async (req, res) => {})
router.delete('/:id', async (req, res) => {})

module.exports = router