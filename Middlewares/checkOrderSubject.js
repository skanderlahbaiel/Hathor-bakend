// Check the subject of the order and continue or require admin confirmation
function checkOrderSubject(req, res, next) {
    // Check the subject of the order
    const subject = req.body.subject;
  
    if (subject.toLowerCase() === "desk") {
      // The subject is "desk", continue to the next middleware
      console.log('Subject is "desk". Continuing to the next middleware.');
      next();
    } else {
      // The subject is not "desk", respond with a message requiring admin confirmation
      res.status(400).json({ error: 'This subject requires admin confirmation.' });
    }
  }
  
  module.exports = checkOrderSubject;
  