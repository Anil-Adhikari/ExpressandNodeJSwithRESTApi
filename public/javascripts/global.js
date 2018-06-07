// Userlist data array for filling in info box
var userListData = [];

// DOM Ready
$(document).ready(function(){
  // populate the user table on initial page load
  populateTable();

  $('#addUser fieldset input').val('');

  $('#btnUpdateUser').attr("disabled", "disabled");

  // Username link clicked
  $('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);

  // Add user button click
  $('#btnAddUser').on('click', addUser);

  // Update user button click
  $('#btnUpdateUser').on('click', updateUser);

  // Delete User link click
  $('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);

  // Update user link click
  $('#userList table tbody').on('click', 'td a.linkupdateuser', editUser);
});

// Function to fill table with userListData
function populateTable(){
  // Empty content string
  var tableContent = "";

  // jQuery AJAX call for json
  $.getJSON('/users/userlist', function(data){
    $.each(data, function(){
      userListData = data;
    });
    // for each item in our json, add a table row and cells
    // to the content string
    $.each(data, function(){
      tableContent += '<tr>';
      tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '">' + this.username + '</a></td>';
      tableContent += '<td>' + this.email + '</td>';
      tableContent += '<td>' +
                        '<a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a>' + '&nbsp;' +
                        '<a href="#" class="linkupdateuser" rel="' + this._id + '">update</a>' +
                      '</td>';
      tableContent += '</tr>';
    });

    //Inject the whole content string into our existing HTML table
    $('#userList table tbody').html(tableContent);
  });
};

// Show user info
function showUserInfo(event){
  // prevent link from firing
  event.preventDefault();

  // retrieve username from link rel attribut
  var thisUserName = $(this).attr('rel');

  // Get index of object based on id value
  var arrayPosition = userListData.map(function(arrayItem){
    return arrayItem.username;
  }).indexOf(thisUserName);

  // Get our User object
  var thisUserObject = userListData[arrayPosition];

  // Populate Info box
  $('#userInfoName').text(thisUserObject.fullname);
  $('#userInfoAge').text(thisUserObject.age);
  $('#userInfoGender').text(thisUserObject.gender);
  $('#userInfoLocation').text(thisUserObject.location);
};

// Add user
function addUser(event){
  event.preventDefault();

  // Super basic validation - increase errorCount variable if any fields are blank
  var errorCount = 0;
  $('#addUser input').each(function(index, val){
    if($(this).val() === ''){errorCount++;}
  });

  // Check and make sure errorCount's still at zero
  if(errorCount === 0){
    // If it is, compile all user info into one object
    var newUser = {
      'username': $('#addUser fieldset input#inputUserName').val(),
      'email': $('#addUser fieldset input#inputUserEmail').val(),
      'fullname': $('#addUser fieldset input#inputUserFullname').val(),
      'age': $('#addUser fieldset input#inputUserAge').val(),
      'location': $('#addUser fieldset input#inputUserLocation').val(),
      'gender': $('#addUser fieldset input#inputUserGender').val()
    };

    // Use AJAX to post the object to our adduser service
    $.ajax({
      type: 'POST',
      data: newUser,
      url: '/users/adduser',
      dataType: 'JSON'}).done(function(response){

        // Check for successful (blank) response
        if(response.msg === ''){

          // Clear the form inputs
          $('#addUser fieldset input').val('');

          // Update the table
          populateTable();
        }
        else{
          // If something goes wrong, alert the error message
          // that our service returned
          alert('Error: ' + response.msg);
        }
      });
  }
  else{
    // If errorCount is more than 0, error out
    alert('Please fill in all fields');
    return false;
  }

};

// Delete User
function deleteUser(event){
  event.preventDefault();

  // Pop up a confirmation dialog
  var confirmation = confirm('Are you sure you want to delete this user?');

  // Check and make sure the user confirmed
  if(confirmation === true){
    // If they did, do our delete
    $.ajax({
      type: 'DELETE',
      url: '/users/deleteuser/' + $(this).attr('rel')
    }).done(function(response){
      // Check for successful response
      if(response.msg === ''){

      }else{
        alert('Error: ' + response.msg);
      }

      // update the table
      populateTable();
    });
  }
  else{
    // If they said no to the confirm, do nothing
    return false;
  }
};

// Edit user
function editUser(event){
  event.preventDefault();

  $('#btnAddUser').attr("disabled", "disabled");
  $('#btnUpdateUser').removeAttr("disabled");
  $('#btnUpdateUser').attr('rel', $(this).attr('rel'));

  var thisUser = $(this).attr('rel');

  var arrayPosition = userListData.map(function(arrayItem){return arrayItem._id;}).indexOf(thisUser);
  var userObject = userListData[arrayPosition];

  console.log(userObject);

  $('#addUser fieldset input#inputUserName').val(userObject.username);
  $('#addUser fieldset input#inputUserEmail').val(userObject.email);
  $('#addUser fieldset input#inputUserFullname').val(userObject.fullname);
  $('#addUser fieldset input#inputUserAge').val(userObject.age);
  $('#addUser fieldset input#inputUserLocation').val(userObject.location);
  $('#addUser fieldset input#inputUserGender').val(userObject.gender);

};

// Update user
function updateUser(event){
  event.preventDefault();

  var errorCount = 0;
  $('#addUser fieldset input').each(function(index, val){
    if($(this).val() === ''){errorCount++;}
  });

  if(errorCount === 0){
    var updatedUser = {
      'username': $('#addUser fieldset input#inputUserName').val(),
      'email': $('#addUser fieldset input#inputUserEmail').val(),
      'fullname': $('#addUser fieldset input#inputUserFullname').val(),
      'age': $('#addUser fieldset input#inputUserAge').val(),
      'location': $('#addUser fieldset input#inputUserLocation').val(),
      'gender': $('#addUser fieldset input#inputUserGender').val()
    };

    $.ajax({
      type: 'PUT',
      url: '/users/updateuser/' + $(this).attr('rel'),
      data: updatedUser,
      dataType: 'JSON'
    }).done(function(response){
      if(response.msg === ''){
        $('#addUser fieldset input').val('');
        populateTable();
      }else{
        alert('Error: ' + response.msg);
      }
    });

  }else{
    alert("You can not leave any field blank");
    return false;
  }
};
