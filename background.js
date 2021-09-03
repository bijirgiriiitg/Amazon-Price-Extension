console.log('Background script running!');
let dev = true;
let domain = dev ? "http://localhost:8000/" : 'https://myamazonhistory.com/';

chrome.runtime.onMessage.addListener(
    function(message, sender, sendResponse) {
        switch(message.type) {
            case 'onPopupInit':
                console.log('Ran onPopupInit Case in background.js');
                sendResponse(getStorageItem('user'));
                return true;
                break;
            case "login":
                console.log('login logic ran with formData = to', message.data);
                let userLoginCreds = message.data;
                userLoginCreds.username = message.data.email.split('@')[0];
                ajaxCall("POST", "user/login", userLoginCreds, '', function(response){
                   console.log('response from server is: ',response);
                   setStorageItem('user',response);
                   sendResponse(response);
                })
                return true;
                break;
            case "signup":
            	console.log('signup logic with formData = to', message.data);
              let userCreds = message.data;
              userCreds.username = message.data.email.split('@')[0];
              ajaxCall("POST", "user/signup", userCreds, '', function(response){
                  console.log('response from server is: ',response);
                  sendResponse(response);
              })
            	return true;
              break;
            case 'initiateHistoryScraping':
                console.log('message: ',message);
                chrome.tabs.create({url: 'https://www.amazon.in/gp/css/order-history?ahf=on'});
                return true;
                break;
            case 'purchaseYears':
              console.log('purchaseYears event was hit in background');
              let purchaseYears = [];
              for (let i = 0; i < message.data.length; i++) { 
                let value = message.data[i];
                if(value.includes('-')&&!value.includes('months')){
                   purchaseYears.unshift(value.split('-')[1]);
                }
              }
              setStorageItem(message.type, purchaseYears);
              sendResponse('all good');
              return true;
              break;
            case 'ordersPageDetails':
              let paginationDetails = message.data.paginationDetails;
              if (paginationDetails === undefined || paginationDetails.length == 0) {
                  page_number = 1; 
                  multi_page = false;
              } else {
                multi_page = 1;
              }

              message.data._id = getStorageItem('user').user._id;
              message.data.multi_page = multi_page;
              message.data.total_pages = paginationDetails.length == 0 ? 1 : paginationDetails.length; 
              setStorageItem(message.type, message.data);
              ajaxCall('POST', 'product', message.data, getStorageItem('user') ? getStorageItem('user').token : '', function(response){
                let nextWhat = '';
                let year = 0;
                let startIndex = 0;
                let purchaseYears = getStorageItem('purchaseYears');

                console.log('response from api/extension/products',response);
                if(response.multiPageYear=="false"){
              
                  let index = purchaseYears.indexOf(response.purchaseYear.toString());

                
                  nextWhat = 'nextYear';
                  year = purchaseYears[index + 1];
                } else {
                 
                  
                  if(response.yearlyPageNumber == response.totalPagesOfYear){
                  
                    let index = purchaseYears.indexOf(response.purchaseYears.toString());
        
                    nextWhat = 'nextYear';
                    year = purchaseYears[index + 1];
                  } else {
                
                    startIndex = response.yearlyPageNumber*10;
                    nextWhat = 'nextPage';
                    year = response.purchaseYear;
                  }
                }
                sendResponse({nextWhat: nextWhat, year:year, startIndex:startIndex});
              });
              return true;
              break;
            default:
            	console.log('couldnt find matching case');
        }
});


function ajaxCall(type, path, data, token, callback){
  $.ajax({
    url: domain+path,
    type: type,
    data: data,
    headers: {
        token: token
    },
    success: function(response){
      console.log('response: ', response)
      callback(response);
    },
    error: function(response){
      console.log('response: ', response)
      callback(response);
    }
  });
}

function setStorageItem(varName, data){
  console.log('varName: ', varName);
  if(varName!='searchPageData'){
    console.log('data', data);
    window.localStorage.setItem(varName, JSON.stringify(data));
  }
}

function getStorageItem(varName){
  return JSON.parse(localStorage.getItem(varName));
}