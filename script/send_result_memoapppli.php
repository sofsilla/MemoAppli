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
		$email->Body      = 'MemoAppli Résultats.';
		$email->CharSet = "UTF-8";
		//$email->AddAddress( 'memoappli@alwaysdata.net' );
		$email->AddAddress(  $_POST['mail'] );

		$file_to_attach = tempnam($_SERVER['DOCUMENT_ROOT'].'script/', 'result_');
		$file = fopen($file_to_attach, "w+");
		fwrite($file, $_POST['json_data']);
		fseek($file, 0);
		echo fread($file, 1024);
		$name = 'res_'.date('m.d.Y_h.i.s', time()).'.json';

		$file_to_attach_2 = tempnam($_SERVER['DOCUMENT_ROOT'].'script/', 'result_csv_');
		$file_2 = fopen($file_to_attach_2, "w+");
		fwrite($file_2, $_POST['csv_data']);
		fseek($file_2, 0);
		echo fread($file_2, 1024);
		$name_2 = 'res_'.date('m.d.Y_h.i.s', time()).'.csv';

		$email->AddAttachment( $file_to_attach , $name );
		$email->AddAttachment( $file_to_attach_2 , $name_2 );



		if($email->Send())
		{
			echo "Mail Sent Successfully";
		}else{
			echo "Mail Not Sent";
		}


		fclose($file); // ceci va effacer le fichier
		fclose($file_2); // ceci va effacer le fichier
		unlink($file_to_attach);
		unlink($file_to_attach_2);


		}

?>