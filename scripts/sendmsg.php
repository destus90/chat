<?php
   header('Content-Type: text/html; charset=utf-8');
   function validate($name,$msg){
       $errorText = '';
       if (strlen($msg) > 255){
           $errorText .= "<p><b>Допускается не более 255 символов</b></p>";
       }
       if ($msg == ''){
           $errorText .= "<p><b>Пустые сообщения запрещены</b></p>";
       }
       if ($name == ''){
           $errorText .= "<p><b>Введите имя</b></p>";
       }
       if ($errorText!='') {
           echo $errorText;
           die();
           return false;
       }
       return true;
       }

    $con=mysqli_connect("localhost","root","","test");
    // Check connection
    if (mysqli_connect_errno())
    {
        echo "Failed to connect to MySQL: " . mysqli_connect_error();
    }
    $name = htmlspecialchars(trim($_POST['username']));
    $msg = htmlspecialchars(trim($_POST['msg']));
    $date = date("Y-m-d H:i:s");
    validate($name,$msg);
    $result = mysqli_query($con,"INSERT INTO chat_message (name,message,date)
                        VALUES ('$name','$msg','$date')");
    mysqli_close($con);

?>