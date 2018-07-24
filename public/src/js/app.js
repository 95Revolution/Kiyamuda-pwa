var deferredPrompt;

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/sw.js')
    .then(function() {
      console.log('Service Worker Registerd');
    })
    .catch(function(err) {
      console.log(err);
    });
}

window.addEventListener('beforeinstallprompt', function(event) {
  console.log('beforeinstallprompt fired');
  event.preventDefault();
  deferredPrompt = event;
  return false;
});

var promise = new Promise(function(resolve, reject) {
  setTimeout(function() {
    reject({ code: 500, message: 'An Error Occured' });
  }, 3000);
});

fetch('http://httpbin.org/ip')
  .then(function(response) {
    console.log(response);
    return response.json();
  })
  .then(function(data) {
    console.log(data);
  })
  .catch(function(err) {
    console.log(err);
  });

fetch('http://httpbin.org/post', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  },
  mode: 'cors',
  body: JSON.stringify({ message: 'Does this work?' })
})
  .then(function(response) {
    console.log(response);
    return response.json();
  })
  .then(function(data) {
    console.log(data);
  })
  .catch(function(err) {
    console.log(err);
  });

promise
  .then(function(text) {
    return text;
  })
  .then(function(newText) {
    console.log(newText);
  })
  .catch(function(err) {
    console.log(err.code, err.message);
  });

console.log('This is executed right after setTimeOut()');
