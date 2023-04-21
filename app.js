const express = require('express');
const app = express();
const ExpressError = require('./expressError');

app.get('/mean', function(req, res, next){
    if (!req.query.nums){
        throw new ExpressError('You must pass a query key of nums with a comma-separated list of numbers.', 400);
    }
    const numString = req.query.nums;
    const nums = numString.split(',').map(num => parseInt(num));
    if (nums.some(isNaN) || nums.length === 0) {
        throw new ExpressError("Invalid input", 400);
    }
    const mean = nums.reduce((acc, curr) => acc + curr, 0) / nums.length;
    return res.json({operation: "mean",
              value: mean});


});

app.get('/median', function(req, res, next){
    if (!req.query.nums) {
        throw new ExpressError('You must pass a query key of nums with a comma-separated list of numbers.', 400)
      }
    const numString = req.query.nums;
    const nums = numString.split(',').map(num => parseInt(num));
    if (nums.some(isNaN) || nums.length === 0) {
        throw new ExpressError("Invalid input", 400);
    }
    nums.sort((a, b) => a - b);
    let median;
    if (nums.length%2 ===0){
        median = (nums[nums.length/2 -1] + nums[nums.length/2]);
    }else{
        median = nums[Math.floor(nums.length/2)];
    }
    return res.json({operation: "median",
              value: median});


});

app.get('/mode', function(req, res, next){
    if (!req.query.nums) {
        throw new ExpressError('You must pass a query key of nums with a comma-separated list of numbers.', 400)
    }
    const numString = req.query.nums;
    const nums = numString.split(',').map(num => parseInt(num));
    if (nums.some(isNaN) || nums.length === 0) {
        throw new ExpressError("Invalid input", 400);
    }
    let freqCounter = {};
    let count = 0;
    let mode = null;
    for (let num of nums){
        freqCounter[num] = freqCounter[num] || 0;
        freqCounter[num]++;
        if (freqCounter[num] > count){
            mode = num
            count = freqCounter[num]
        }
    }
    return res.json({operation: "mode",
    value: mode});
});

// Add a middleware function to handle 404 errors when the requested route does not exist.
app.use(function (req, res, next) {
    const err = new ExpressError("Not Found",404);
  
    // pass the error to the next piece of middleware
    return next(err);
});
  
  /** general error handler */
  
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
  
    return res.json({
      error: err,
      message: err.message
    });
});
  

app.listen(3000, function(){
    console.log('App on port 3000')
})