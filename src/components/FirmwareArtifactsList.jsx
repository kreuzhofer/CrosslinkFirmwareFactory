import React from 'react'
import { Storage } from 'aws-amplify'
import {
	Button,
	Table,
	Icon,
} from 'semantic-ui-react'

export class FirmwareArtifactsList extends React.Component {
    downloadBlob(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
//        console.log("Download URL for "+filename+": "+url);
        a.download = filename || 'download';
        const clickHandler = () => {
          setTimeout(() => {
            URL.revokeObjectURL(url);
            a.removeEventListener('click', clickHandler);
          }, 150);
        };
        a.addEventListener('click', clickHandler, false);
        a.click();
        return a;
    }

    handleDownload = async(e, jobId, file) => {
			e.preventDefault();
			const result = await Storage.get(jobId+'/'+file, { download: true });
			//const result = await Storage.get(job.id+'/'+file);
			//console.log(result);
			this.downloadBlob(result.Body, file);
    }

    render(){
			return (
					<Table celled>
							<Table.Header>
									<Table.Row>
									<Table.HeaderCell>Name</Table.HeaderCell>
									<Table.HeaderCell>File</Table.HeaderCell>
									</Table.Row>
							</Table.Header>

							<Table.Body>
									{this.props.artifacts.map(a=>
											<Table.Row key={a.id}>
													<Table.Cell>{a.artifactName}</Table.Cell>
													<Table.Cell>
															{a.artifactFileName}
															<Button animated='vertical' onClick={(e)=>this.handleDownload(e, a.buildJobID, a.artifactFileName)}>
																	<Button.Content hidden>Download</Button.Content>
																	<Button.Content visible><Icon name="download"/></Button.Content>
															</Button>
													</Table.Cell>
											</Table.Row>
									)}
							</Table.Body>
					</Table>
			)
    }
}