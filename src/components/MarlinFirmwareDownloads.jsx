import React from 'react'
import { API, graphqlOperation, Storage } from 'aws-amplify'
import {
    Header, 
    Segment, 
    Table,
    Button,
    Icon,
    Search,
    Message
  } from 'semantic-ui-react'
import * as comparator from '../util/comparator';
import * as customqueries from '../graphql/customqueries'
import * as queries from '../graphql/queries'
import _ from 'lodash';

import mixpanel from 'mixpanel-browser';
mixpanel.init('b797e33ed9db411af6893878c06f6522');

export class MarlinFirmwareDownloads extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            isLoading: false,
            buildDefinitions: [],
            results: [],
            oldResults: [],    
            searchValue: ''
        }
    }

    resetComponent = () => {
        this.setState ({
            isLoading: false,
            results: [],
            oldResults: this.state.buildDefinitions,    
            searchValue: ''
        });
    }

    async reloadData() {
        try {
            var result = await API.graphql(graphqlOperation(queries.listBuildDefinitions, {limit:999}));
            var items = result.data.listBuildDefinitions.items
            var nextToken = null;
            if(result.data.listBuildDefinitions.nextToken) nextToken = result.data.listBuildDefinitions.nextToken
            while(nextToken)
            {
                var nextResult = await API.graphql(graphqlOperation(queries.listBuildDefinitions, {limit: 999, nextToken: nextToken}));
                nextResult.data.listBuildDefinitions.items.forEach((v)=>items.push(v));
                nextToken = nextResult.data.listBuildDefinitions.nextToken;
            }
            console.info(items);
            items = items.filter(i=>i.groupsCanAccess.includes("Everyone"));
            this.setState({buildDefinitions: items, oldResults: items});
        } catch (error) {
            console.error(error);
        }
    }

    async componentDidMount() {
        await this.reloadData();
    }

    downloadBlob(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
//            console.log("Download URL for "+filename+": "+url);
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

    firmwareArtifacts(jobs){

        const handleDownload = async(e, jobId, file) => {
            e.preventDefault();
            mixpanel.track("Download_Artifact");
            const result = await Storage.get(jobId+'/'+file, { download: true });
            //const result = await Storage.get(job.id+'/'+file);
//            console.log(result);
            this.downloadBlob(result.Body, file);
          }

        if(jobs == null)
            return null;
        let finishedJobs = jobs.sort(comparator.makeComparator('createdAt', 'desc')).filter(j=>j.jobState === 'DONE').slice(0,1);
//        console.log(finishedJobs);
        if(finishedJobs){
            let first = finishedJobs[0];
            if(!first)
                return null;
//            console.log(first);
            let artifacts = first.buildJobArtifacts.items
            return (
                <Table celled>
                    <Table.Header>
                        <Table.Row>
                        <Table.HeaderCell>Firmware</Table.HeaderCell>
                        <Table.HeaderCell>Artifacts</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        <Table.Row>
                            <Table.Cell>
                                {first.firmwareVersion ? first.firmwareVersion.name : "custom"}
                            </Table.Cell>
                            <Table.Cell>
                                <Table celled>
                                    <Table.Header>
                                        <Table.Row>
                                            <Table.HeaderCell>Name</Table.HeaderCell>
                                            <Table.HeaderCell>File</Table.HeaderCell>
                                        </Table.Row>
                                    </Table.Header>

                                    <Table.Body>
                                        {artifacts.map(a=>
                                            <Table.Row key={a.id}>
                                                <Table.Cell>{a.artifactName}</Table.Cell>
                                                <Table.Cell>
                                                    {a.artifactFileName}
                                                    <Button animated='vertical' onClick={(e)=>handleDownload(e, a.buildJobID, a.artifactFileName)}>
                                                        <Button.Content hidden>Download</Button.Content>
                                                        <Button.Content visible><Icon name="download"/></Button.Content>
                                                    </Button>
                                                </Table.Cell>
                                            </Table.Row>
                                        )}
                                    </Table.Body>
                                </Table>
                            </Table.Cell>
                        </Table.Row>                    
                    </Table.Body>
                </Table>
            )
        }
    }

    renderBuildDefinitions() {
        const { searchValue, results, oldResults, isLoading } = this.state
        const dataToShow = (_.isEmpty(results) && !searchValue) || isLoading ? oldResults : results

        const handleBuildDownload = async(e, defId) => {
            e.preventDefault();
            mixpanel.track("Download_Artifact");

            try {
                const result = await API.graphql(graphqlOperation(customqueries.getBuildDefinitionWithBuildJobs, {id: defId}));
                var defWithJobs = result.data.getBuildDefinition
                console.log(defWithJobs);
                console.log(defWithJobs.buildJobs.items);
                var jobs = defWithJobs.buildJobs.items.filter((value)=>value.jobState==="DONE");
                console.log(jobs);
                var jobsSorted = jobs.sort((a, b)=>a.createdAt < b.createdAt ? 1 : a.createdAt > b.createdAt ? -1 : 0)
                console.log(jobsSorted);
                if(jobsSorted.length>0)
                {
                    var latestJob = jobsSorted[0];
                    console.log(latestJob);
                    var binaryArtifacts = latestJob.buildJobArtifacts.items.filter((value)=>value.artifactName === "Marlin firmware binary");
                    console.log(binaryArtifacts);
                    if(binaryArtifacts.length>0)
                    {
                        var binaryArtifact = binaryArtifacts[0];
                        console.log(binaryArtifact);
                        const result = await Storage.get(latestJob.id+'/'+binaryArtifact.artifactFileName, { download: true });
                        console.log(result);
                        this.downloadBlob(result.Body, binaryArtifact.artifactFileName);
                    }
                }
            } catch (error) {
                console.error(error);
            }

          }

        return dataToShow
        .sort((a,b)=>{
            return comparator.makeComparator('printerManufacturer')(a,b)+comparator.makeComparator('printerModel')(a,b)+comparator.makeComparator('printerMainboard')(a,b)
          })
        .map(def => 
        <Table.Row key={def.id}>
          <Table.Cell>{def.printerManufacturer}</Table.Cell>
          <Table.Cell>{def.printerModel}</Table.Cell>
          <Table.Cell>{def.printerMainboard}</Table.Cell>            
          <Table.Cell>{def.firmwareVersion ? def.firmwareVersion.name : "custom"}</Table.Cell>
          <Table.Cell><a href={"/Marlin/"+def.id}>{def.name}</a></Table.Cell>
          <Table.Cell>{def.description}</Table.Cell>
          <Table.Cell>
              <Button animated='vertical' onClick={(e)=>handleBuildDownload(e, def.id)}>
                  <Button.Content hidden>Download</Button.Content>
                  <Button.Content visible><Icon name='download'/></Button.Content>
              </Button>
          </Table.Cell>
          {/* <Table.Cell>{this.firmwareArtifacts(def.buildJobs.items)}</Table.Cell> */}
            <Table.Cell>
                    <Button animated='vertical' onClick={()=>this.props.history.push('/AddBuildDefinition/'+def.id)}>
                        <Button.Content hidden>Clone</Button.Content>
                        <Button.Content visible><Icon name='clone'/></Button.Content>
                    </Button>
            </Table.Cell>
        </Table.Row>)
    }

    handleSearchChange(e, { value }) {
        setTimeout(() => {
        this.setState({ isLoading: true, searchValue: value })
    
        if (this.state.searchValue.length < 1) return this.resetComponent()
                
        var terms = this.state.searchValue.split(' ');
        var escapedTerms = [];
        terms.forEach(element => {
            if(element !== '')
                escapedTerms.push('(?=.*'+_.escapeRegExp(element)+')');
        });
        var regExpString = escapedTerms.join('');
        const re = new RegExp(regExpString, 'i');
        const filteredResults = _.filter(this.state.buildDefinitions, result => 
            re.test(result.printerManufacturer+' '+
            result.printerModel+ ' '+
            result.printerMainboard + ' '+
            result.name)
            )
            this.setState({
                isLoading: false,
                results: filteredResults,
                oldResults: filteredResults
            })
        }, 30);
    };

    render() {
        const boundHandleSearchChange = this.handleSearchChange.bind(this);
        const { searchValue, isLoading } = this.state
        return (
            <Segment>
                <Header as='h3'>Firmware builds</Header>
                <Message>
                    <Message.Header>We made some changes to this page</Message.Header>
                    <Message.List>
                        <Message.Item>The list of firmware has been condensed to contain only the essential information.</Message.Item>
                        <Message.Item>You can download the latest build for a firmware by clicking on the download button in each row.</Message.Item>
                        <Message.Item>For more details about a firmware, click on the name of the firmware.</Message.Item>
                    </Message.List>
                </Message>                
                <p><b>Missing a firmware for your printer?</b> Post a request in the channel #firmware-factory-alpha on our discord server: <a href='https://discord.gg/ne3J4Rf'>https://discord.gg/ne3J4Rf</a></p>
                <Search 
                    open={false}
                    loading={isLoading}
                    onSearchChange={_.debounce(boundHandleSearchChange, 500, { leading: true})}
                    value={searchValue}
                    />
                <Table celled>
                <Table.Header>
                    <Table.Row>
                    <Table.HeaderCell>Manufacturer</Table.HeaderCell>
                    <Table.HeaderCell>Model</Table.HeaderCell>
                    <Table.HeaderCell>Variant / Preset</Table.HeaderCell>                        
                    <Table.HeaderCell>Firmware</Table.HeaderCell>
                    <Table.HeaderCell>Name</Table.HeaderCell>
                    <Table.HeaderCell>Description</Table.HeaderCell>
                    <Table.HeaderCell>Builds</Table.HeaderCell>
					<Table.HeaderCell>Actions</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {this.renderBuildDefinitions()}
                </Table.Body>
                </Table>
                <p><b>Missing a firmware for your printer?</b> Post a request in the channel #firmware-factory-alpha on our discord server: <a href='https://discord.gg/ne3J4Rf'>https://discord.gg/ne3J4Rf</a></p>
            </Segment>
        )
    }
}