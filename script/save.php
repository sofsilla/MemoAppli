
<!DOCTYPE html>
<html>
<body>

	<h1>My First Heading</h1>

	<p>My first paragraph.</p>

	<?php 

	use PHPMailer\PHPMailer\PHPMailer;
	use PHPMailer\PHPMailer\Exception;

	require 'PHPMailer/src/Exception.php';
	require 'PHPMailer/src/PHPMailer.php';
	require 'PHPMailer/src/SMTP.php';


	if( !empty($_POST['json_data']) )
	{

		$email = new PHPMailer();
		$email->From      = 'memoappliprototype@nepasrepondre.com';
		$email->FromName  = 'MemoAppli-auto';
		$email->Subject   = 'MemoAppli Résultat (Ne pas répondre)';
		$email->Body      = $_POST['json_data'];
		$email->CharSet = "UTF-8";
		$email->AddAddress( 'memoappli@alwaysdata.net' );

		$file_to_attach = tempnam($_SERVER['DOCUMENT_ROOT'].'script/', 'result_');

		$file = fopen($file_to_attach, "w+");

		fwrite($file, $_POST['json_data']);
		fseek($file, 0);
		echo fread($file, 1024);

		$name = 'res_'.date('m.d.Y_h.i.s', time()).'.json';
		$email->AddAttachment( $file_to_attach , $name );



		if($email->Send())
		{
			echo "Mail Sent Successfully";
		}else{
			echo "Mail Not Sent";
		}


		fclose($file); // ceci va effacer le fichier
		unlink($file_to_attach);


		}

?>

<form action="send_result_memoapppli.php" method="post" id="usrform">
	<p><input type="submit" value="OK"></p>
</form>

<textarea name="json_data" form="usrform">Enter text here...</textarea>

Bonjour, <?php echo htmlspecialchars($_POST['json_data']); ?>.

</body>
</html>