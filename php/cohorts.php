<? php
		$source = 'type';
		$value = 'all';
	
        $db_username = "u260357075_gconwayuk";
        $db_password = "#LovethePeaks48";
        $db_host = "sql582.main-hosting.eu";
        $db_name = "u260357075_cohortology";
   
        $dsn = "mysql:host=$db_host;dbname=$db_name";
        $pdo = new PDO($dsn, $db_username, $db_password);
	
    
		if ($source === 'type') {  

			if ($value === 'all') 
				{
					$sql = "SELECT * FROM cohorts ORDER BY cohort_name";
					}
				else {
					$sql = "SELECT * FROM cohorts WHERE cohort_type = '$value' ORDER BY cohort_name";
				}
		}
		else {
			$value = '%'.$value.'%';
			
				$sql = "SELECT * FROM cohorts WHERE cohort_name LIKE '$value'";
			}
	
			
	try {
			$stmt = $pdo->prepare("$sql");
			$stmt->execute();

			$result = $stmt->fetchAll();
			$stmt = null;
			$pdo = null;
		} 
		catch (PDOException $e) {
			$error = $e->getMessage();
		}

        foreach($result as $key => $row) {
			//$path = "'".'{{url_for("templates-show")}}'."'"  ;          //"location.href='{{url_for('templates-show')}}'"
			//$href = 'location.href='.                                           //'{{ url_for("templates-show"}}';  
			//echo "v1 ".$href; 
			$onclick = 'onclick='."location.href='{{url_for('templates-show')}}'";
			//echo ' onclick='.'"'.'location.href='."'".'{{url_for('."'".'templates-show'."'".')}}'."'".'"'.' >';
			//$tab = "showTab('#details')";
			//echo '<div id='.$row["event_id"].' onclick='.'"'.'location.href='."'".'/templates-show'."'".')}}'."'".'"'.' >';
			echo '<div id='.$row["event_id"].' onclick='.'"'.'testJS()'.'"'.' >';
			echo '<a href = "" style="font-size: vsmall; font-decoration: underline; display: block;" id='.$row["event_id"].'>'.$row["event_name"].'</a>';
			echo '</div>';
	   }

 