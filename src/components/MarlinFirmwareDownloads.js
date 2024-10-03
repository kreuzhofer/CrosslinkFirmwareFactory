import _ from 'lodash';
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Header, 
    Segment, 
    Table,
    Button,
    Icon,
    Search,
    Message,
    Dimmer,
    Loader,
    Image
  } from 'semantic-ui-react'
import * as comparator from '../util/comparator';
import mixpanel from 'mixpanel-browser';
mixpanel.init('b797e33ed9db411af6893878c06f6522');

const https = require('https')
const env = process.env["REACT_APP_ENV"];
const restapiurl = process.env["REACT_APP_REST_API_BASEURL"]+env;

function MarlinFirmwareDownloads () {

    const [isLoading, setIsLoading] = useState(false);
    const [buildDefinitions, setBuildDefinitions] = useState([]);
    const [results, setResults] = useState([]);
    const [oldResults, setOldResults] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [dataLoading, setDataLoading] = useState(true);
    const navigate = useNavigate();

    const resetComponent = () => {
        setIsLoading(false);
        setResults([]);
        setOldResults(buildDefinitions);
        setSearchValue('');
    }

    async function request(url, data) {
        return new Promise((resolve, reject) => {
            let req = https.request(url, function (res) {
                let body = ''
                res.on('data', (chunk) => { body += chunk })
                res.on('end', () => { resolve(body) })
            })
            req.write(data)
            req.end()
        })
    }    

    useEffect(()=>{
        const reloadData = async () => {
            try {
                var result = await request(restapiurl+"/firmwarebuilds", "");
                var items = JSON.parse(result);
                console.info(items);
                setBuildDefinitions(items);
                setOldResults(items);
            } catch (error) {
                console.error(error);
            }
            setDataLoading(false);
            return true;
        }
        reloadData();
    }, []);

    function downloadBlob(url, filename) {
        const a = document.createElement('a');
        a.href = url;
        console.log("Download URL for "+filename+": "+url);
        a.download = filename || 'download';
        const clickHandler = () => {
          setTimeout(() => {
            a.removeEventListener('click', clickHandler);
          }, 150);
        };
        a.addEventListener('click', clickHandler, false);
        a.click();
        return a;
      }

    function renderBuildDefinitions() {
        const dataToShow = (_.isEmpty(results) && !searchValue) || isLoading ? oldResults : results

        const handleBuildDownload = async(e, defId) => {
            e.preventDefault();
            mixpanel.track("Download_Artifact");

            try {
                var firmwareBuildResult = await request(restapiurl+"/firmwarebuilds/"+defId, "");
                var defWithJobs = JSON.parse(firmwareBuildResult);
                console.info(defWithJobs);
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
                        // fetch signed url from service
                        var result = await request(restapiurl+"/firmwareartifact/"+latestJob.id+"/"+binaryArtifact.artifactFileName, "");
                        console.log(result);
                        var jsonResult = JSON.parse(result);
                        downloadBlob(jsonResult.url, binaryArtifact.artifactFileName);
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
            <Table.Cell>
                <Image src={def.ownerImageUrl} avatar/><span>{def.ownerAlias}</span>
            </Table.Cell>
          <Table.Cell><a href={"/BuildDefinition/"+def.id}>{def.name}</a></Table.Cell>
          <Table.Cell>{def.description}</Table.Cell>
          <Table.Cell>
          { def.buildJobs.items.length > 0 ? 
                <Button animated='vertical' onClick={(e)=>handleBuildDownload(e, def.id)}>
                  <Button.Content hidden>Download</Button.Content>
                  <Button.Content visible><Icon name='download'/></Button.Content>
              </Button>
          : null }
          </Table.Cell>
            <Table.Cell>
                    <Button animated='vertical' onClick={()=>navigate('/AddBuildDefinition/'+def.id)}>
                        <Button.Content hidden>Clone</Button.Content>
                        <Button.Content visible><Icon name='clone'/></Button.Content>
                    </Button>
            </Table.Cell>
        </Table.Row>)
    }

    function handleSearchChange(e, { value }) {
        setTimeout(() => {
        setIsLoading(true);
        setSearchValue(value);
    
        if (value.length < 1) return resetComponent()
                
        var terms = value.split(' ');
        var escapedTerms = [];
        terms.forEach(element => {
            if(element !== '')
                escapedTerms.push('(?=.*'+_.escapeRegExp(element)+')');
        });
        var regExpString = escapedTerms.join('');
        const re = new RegExp(regExpString, 'i');
        let filteredResults = _.filter(buildDefinitions, result => 
            re.test(result.printerManufacturer+' '+
            result.printerModel+ ' '+
            result.printerMainboard + ' '+
            result.name)
            );
            setIsLoading(false);
            setResults(filteredResults);
            setOldResults(filteredResults);
        }, 30);
    };

    const boundHandleSearchChange = handleSearchChange.bind(this);
    return (
        <Segment>
            <Message
            warning
            icon='exclamation'
            header='The Crosslink Firmware Factory is DEPRECATED and will SHUTDOWN on December 31, 2024, 23:59 CEST.'
            content='Please download all your configurations and firmware builds to back up your data. We will not keep any data beyond December 31st, 2024 and there will be no way to restore it afterwards.'
            />
            <Header as='h3'>Firmware builds</Header>
            <Message>
                <Message.Header>We made some changes to this page</Message.Header>
                <Message.List>
                    <Message.Item>The list of firmware has been condensed to contain only the essential information.</Message.Item>
                    <Message.Item>You can download the latest build for a firmware by clicking on the download button in each row.</Message.Item>
                    <Message.Item>For more details about a firmware, click on the name of the firmware.</Message.Item>
                    <Message.Item>This page is currently a bit slow due to some inefficiencies that we will resolve soon</Message.Item>
                </Message.List>
            </Message>                
            <p><b>Missing a firmware for your printer?</b> Post a request in the channel #firmware-factory-general-discussion on our discord server: <a href='https://discord.gg/ne3J4Rf'>https://discord.gg/ne3J4Rf</a></p>
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
                <Table.HeaderCell width={1}>Mainboard / Variant</Table.HeaderCell>                        
                <Table.HeaderCell width={1}>Firmware</Table.HeaderCell>
                <Table.HeaderCell width={2}>Owner</Table.HeaderCell>
                <Table.HeaderCell width={2}>Name</Table.HeaderCell>
                <Table.HeaderCell width={3}>Description</Table.HeaderCell>
                <Table.HeaderCell>Builds</Table.HeaderCell>
                <Table.HeaderCell>Actions</Table.HeaderCell>
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {dataLoading ? 
                <Table.Row>
                    <Table.Cell colSpan='8'>
                    <Dimmer active>
                        <Loader content='Loading... This may take a few seconds...' />
                    </Dimmer>
                    </Table.Cell>
                </Table.Row>
                : 
                renderBuildDefinitions()
                }
            </Table.Body>
            </Table>
            <p><b>Missing a firmware for your printer?</b> Post a request in the channel #firmware-factory-general-discussion on our discord server: <a href='https://discord.gg/ne3J4Rf'>https://discord.gg/ne3J4Rf</a></p>
        </Segment>
    );
}

export default MarlinFirmwareDownloads;