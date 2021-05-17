import React from 'react'
import { API, graphqlOperation, Storage } from 'aws-amplify'
import {
	Button,
	Table,
	Icon,
	Confirm,
} from 'semantic-ui-react'
import { FirmwareArtifactsList } from './FirmwareArtifactsList'
import * as mutations from '../graphql/mutations'
import * as comparator from '../util/comparator';

export class BuildJobsList extends React.Component {
		/**
    	* @type {array} build definition object
      */
			buildDefinition = null

		constructor(props){
			super(props);
			this.state = {
				jobDeleteConfirmState: {open: false}
			}
		}

		handleJobDeleteConfirm = async() => {
      try {
        let list = await Storage.list(this.state.jobDeleteConfirmState.job.id+'/');
//        console.log(list);
        try {
          list.forEach(async(file)=>{
//            console.log("remove "+file.key);
            await Storage.remove(file.key);
            });
        } catch (error) {
          console.error(error);
        }

        let jobArtifacts = this.state.jobDeleteConfirmState.job.buildJobArtifacts;
        console.log(jobArtifacts.items);
        jobArtifacts.items.forEach(async(artifact)=>await API.graphql(graphqlOperation(mutations.deleteBuildJobArtifact, {input: {id: artifact.id}})));

        const result = await API.graphql(graphqlOperation(mutations.deleteBuildJob, {input: {id: this.state.jobDeleteConfirmState.job.id}}));
//        console.info(result)
      } catch (error) {
        console.error(error);
      }
      this.setState({jobDeleteConfirmState: { open: false }})
    }
    handleJobDeleteCancel = () => this.setState({jobDeleteConfirmState: { open: false }})

		handleJobDelete = (event, job) => {
			event.preventDefault();
			this.setState({jobDeleteConfirmState: {open: true, job: job}});
		}

		downloadBlob(blob, filename) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      console.log("Download URL for "+filename+": "+url);
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

		handleDownload = async(e, job, file) => {
      e.preventDefault();
      const result = await Storage.get(job.id+'/'+file, { download: true });
      //const result = await Storage.get(job.id+'/'+file);
      console.log(result);
      this.downloadBlob(result.Body, file);
    }

		render() {
			if(this.props.buildDefinition.buildJobs.items == null)
				return null;
			return (
				<>
				<Table celled>
				<Table.Header>
					<Table.Row>
						<Table.HeaderCell>Time started</Table.HeaderCell>
						<Table.HeaderCell>State</Table.HeaderCell>
						<Table.HeaderCell>Logs</Table.HeaderCell>
						<Table.HeaderCell>Artifacts</Table.HeaderCell>
						<Table.HeaderCell>Actions</Table.HeaderCell>
					</Table.Row>
				</Table.Header>
					<Table.Body>
						{	this.props.buildDefinition.buildJobs.items.sort(comparator.makeComparator('createdAt', 'desc')).slice(0,3).map(job=>
						<Table.Row key={job.id}>
								<Table.Cell>{job.createdAt}</Table.Cell>
								<Table.Cell>{job.jobState}</Table.Cell>
								<Table.Cell>Logfile.txt
									<Button disabled={this.props.buildDefinition.buildRunning} animated='vertical' onClick={(e)=>this.handleDownload(e, job, "logfile.txt")}>
										<Button.Content hidden>Download</Button.Content>
										<Button.Content visible><Icon name="download"/></Button.Content>
									</Button>
								</Table.Cell>
								<Table.Cell>
									<FirmwareArtifactsList artifacts={job.buildJobArtifacts.items}/>
								</Table.Cell>
								<Table.Cell>
									<Button disabled={this.props.buildDefinition.buildRunning} animated='vertical' onClick={(e)=>this.handleJobDelete(e, job)} color='red'>
										<Button.Content hidden>Delete</Button.Content>
										<Button.Content visible><Icon name='delete'/></Button.Content>
										</Button>
									</Table.Cell>
						</Table.Row>					
						)}
					</Table.Body>
				</Table>
        <Confirm
					open={this.state.jobDeleteConfirmState.open}
					cancelButton='Never mind'
					confirmButton="Yes"
					onCancel={this.handleJobDeleteCancel}
					onConfirm={this.handleJobDeleteConfirm}
				/>
				</>				
			)
		}
}