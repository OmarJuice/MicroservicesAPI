const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();

router.get('/filemeta', function(req, res){
    res.render('file')
})
router.post('/api/filemeta', upload.single('upfile'), function(req, res){
    if(!req.file){
        return res.status(400).send('No file uploaded')
    }
    res.json({
        "name": req.file.originalname,
        "encoding": req.file.encoding,
        "mimetype": req.file.mimetype,
        "size": req.file.size + " bytes"
    })
})

module.exports = router;
