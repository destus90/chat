<?php
    header('Content-type: text/event-stream');
    header('Cache-Control: no-cache');

    class Message
    {
        public $name;
        public $msg;
        public $date;

        public function __construct($name,$msg,$date){
            $this->name = $name;
            $this->msg = $msg;
            $this->date = $date;
        }
    }

    $timeout = 1; //time between query
    $con=mysqli_connect("localhost","root","","test");
    // Check connection
    if (mysqli_connect_errno())
    {
        echo "Failed to connect to MySQL: " . mysqli_connect_error();
    }
    while(true) {
        $allMessage = array();
        if ($result = mysqli_query($con,"SELECT name,message,date FROM chat_message ORDER BY date DESC LIMIT 30")){ // get last 30 message
            while ($row = mysqli_fetch_row($result)){
                //insert into array
                $message = new Message($row[0],$row[1],$row[2]);
                array_push($allMessage,$message);
            }
            echo "data: " . json_encode($allMessage). PHP_EOL;
            echo PHP_EOL;
        };
        flush();
        sleep($timeout);
    }
?>