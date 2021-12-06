import React from 'react'
import { API, graphqlOperation } from 'aws-amplify'
import {Route} from 'react-router-dom'
import {
    Header, 
    Input, 
    Segment, 
    Button,
    Form,
    Label,
    Dropdown, 
    Grid
  } from 'semantic-ui-react'
import TextareaAutosize from 'react-textarea-autosize';

import * as queries from '../graphql/queries'
import * as mutations from '../graphql/mutations'

import AceEditor from "react-ace";
import 'ace-builds/webpack-resolver'
import("ace-builds/src-min-noconflict/ext-language_tools");

const defaultJson = JSON.stringify(JSON.parse(`
{
  "configformatversion" : "2",
  "headerfiles" : [
  {
      "filename" : "Marlin/Configuration.h",
      "settings" : [
        {
          "key": "STRING_CONFIG_H_AUTHOR",
          "enabled": "True",
          "value": "(Your name here)",
          "comment": "This is an example configuration entry"
        }
      ]
  },
  {
      "filename" : "Marlin/Configuration_adv.h",
      "settings" : [
      ]
  }
  ],
  "inifiles" : [
  ]
}
`), null, 3);

export class EditBuildDefinition extends React.Component {

  constructor(props){
    super(props);
    let id = props.match.params.id ? props.match.params.id : "";
    console.log("Id "+id);
    let clone = props.clone ? true : false;
    console.log("Clone "+clone);
		let isAdmin = props.isAdmin ? props.isAdmin : false;
		console.log("IsAdmin "+isAdmin)
    this.state = {
      id: id,
      name: '',
      firmwareVersionId: undefined,
      sourceTree: '',
      configTree: '',
      printerManufacturer: '',
      printerModel: '',
      printerVariant: '',
      platformioEnv: '',
      description: '',
      configurationJSON: defaultJson,      
      sharedWithEveryone: false,
      firmwareOptions: [],
		  isAdmin: isAdmin,
      printerManufacturerSearch: '',
      printerManufacturerOptions: [],
      printerModelSearch: '',
      printerModelOptions: [],
      printerVariantSearch: '',
      printerVariantOptions: [],
      platformioEnvSearch: '',
      platformioEnvOptions: [],
      clone: clone,
      printerMainboardOptions: [],
      selectedMainboard: undefined,
      printerMainboardSearch: '',
    }
  }

  printerManufacturersByFirmwareVersion(id)
  {
    if(!id) return [];
    var jsonList = this.state.firmwareOptions.filter(f=>f.key === id)
    if(jsonList.length>0) // has config json
    { 
       var json = jsonList[0]['defaultconfigjson'];
       console.log(json);
       if(json)
       {
          var jsonObj = JSON.parse(json);
          var printerManufacturerOptions = jsonObj['manufacturers'].sort((a,b)=>a.name > b.name ? 1 : -1).map(v=>{
             return {
                key: v.name, 
                text: v.name, 
                value: v.name,
                printermodels: v.printerModels
             };
          });
          return printerManufacturerOptions;
       }
    }
  }

  printerModelsByManufacturer(value)
  {
      if(!value) return [];
      var printerManuOptions = this.state.printerManufacturerOptions.filter(f=>f.value === value);
      if(printerManuOptions.length===0)
      {
         return [];
      }
      var firstPrinterManuOption = printerManuOptions[0];
      console.log(firstPrinterManuOption);
      var printerModelsFiltered = firstPrinterManuOption.printermodels.sort((a,b)=>a.name > b.name ? 1 : -1).map(v=>{
      return {
         key: v.name, 
         text: v.name, 
         value: v.name,
         variants: v.variants,
         mainboard: v.mainboard,
         environments: v.environments
         };            
      })
      return printerModelsFiltered;
  }

  printerVariantsByPrinterModel(value)
  {
    if(!value) return [];
    var printerVariantsList = this.state.printerModelOptions.filter(f=>f.key === value);
    if(printerVariantsList.length>0)
    {
      console.log(printerVariantsList);
       var printerVariants = printerVariantsList[0]['variants'].map(v=>{
          return {
             key: v.name,
             text: v.name,
             value: v.name,
             environments: v.environments,
             mainboard: v.mainboard
          }
       });
       return printerVariants;
    }
  }

  platformioEnvOptionsByVariant(value)
  {
    if(!value) return [];
    var printerVariantsList = this.state.printerVariantOptions.filter(f=>f.key === value);
    if(printerVariantsList.length>0)
    {
      console.log(printerVariantsList);
      var environments = printerVariantsList[0]['environments'].map(v=>{
        return {
          key: v,
          text: v,
          value: v
        }
      });
      return environments;
    }
  }

  selectedMainboardByPrinterVariant(value)
  {
    if(!value) return [];
    var printerVariantsList = this.state.printerVariantOptions.filter(f=>f.key === value);
    if(printerVariantsList.length>0)
    {
      return printerVariantsList[0]['mainboard'];
    }
  }

  platformioEnvOptionsByModel(value)
  {
    if(!value) return [];
    var filteredList = this.state.printerModelOptions.filter(f=>f.key === value);
    if(filteredList.length>0)
    {
      console.log(filteredList);
      if('environments' in filteredList[0])
      {
        var environments = filteredList[0]['environments'].map(v=>{
          return {
            key: v,
            text: v,
            value: v
          }
        });
        return environments;
      }
      return [];
    }
  }

  selectedMainboardByModel(value)
  {
    if(!value) return [];
    var filteredList = this.state.printerModelOptions.filter(f=>f.key === value);
    if(filteredList.length>0)
    {
      console.log(filteredList);
      if('mainboard' in filteredList[0])
      {
        return filteredList[0]['mainboard'];
      }
      return undefined;
    }
  }

  mainboardOptionsByFirmware(id)
  {
    if(!id) return [];
    var jsonList = this.state.firmwareOptions.filter(f=>f.key === id)
    if(jsonList.length>0) // has config json
    { 
      var json = jsonList[0]['defaultconfigjson'];
      console.log(json);
      if(json)
      {
        var jsonObj = JSON.parse(json);
        var result = jsonObj['mainboards'].sort((a,b)=>a.boardName > b.boardName ? 1 : -1).map(v=>{
            return {
              key: v.boardName,
              text: v.boardDescription,
              value: v.boardName
            }
          });
        return result;
      }
    }
  }

  jsonLower = function (obj)
  {
    var ret = null;
      if (typeof(obj) == "string" || typeof(obj) == "number")
          return obj;
      else if (obj.push)
          ret = [];
      else
          ret = {};
      for (var key in obj)
          ret[String(key).toLowerCase()] = this.jsonLower(obj[key]);
      return ret;
  };

  upgradeJson(json)
  {
    if(!json['configformatversion'])
    {
      json.configformatversion = '2';
    }
    if(!json['headerfiles'])
    {
      json.headerfiles = [
        {
            "filename" : "Marlin/Configuration.h",
            "settings" : [
            ]
        },
        {
            "filename" : "Marlin/Configuration_adv.h",
            "settings" : [
            ]
        }
      ];
    }
    json.headerfiles.forEach(headerfile => {
      var oldSettings = headerfile.settings;
      var convertedSettings = [];
      if(oldSettings)
      {
        oldSettings.forEach(setting => {
          if(Array.isArray(setting))
          {
            if(setting.length===2)
            {
              convertedSettings.push({"key":setting[0], "enabled": (setting[1].toLowerCase()==="true").toString()});
            }
            else if (setting.length===3)
            {
              convertedSettings.push({"key":setting[0], "enabled": (setting[1].toLowerCase()==="true").toString(), "value":setting[2]});
            }
          }
          else
          {
            convertedSettings.push(setting);
          }
        });
      }
      headerfile.settings = convertedSettings;
    });
    return json;   
  }

  async fetchData() {
    try {
      const firmwareResult = await API.graphql(graphqlOperation(queries.listFirmwareVersions))
      const firmwareOptions = firmwareResult.data.listFirmwareVersions.items.sort((a,b)=>a.name > b.name ? 1 : -1).map(v=>{return {
        key: v.id,
        text: v.name,
        value: v.id,
        defaultconfigjson: v.defaultConfigJson,
        mainboards: v.mainboards
      }})
      this.setState({firmwareOptions: firmwareOptions});
      if(!this.state.id || this.state.id === "")
        return;

      const result = await API.graphql(graphqlOperation(queries.getBuildDefinition, {id: this.state.id}));
      const buildDefinition = result.data.getBuildDefinition

      if(this.state.clone)
      {
        buildDefinition.name = "(Copy of) "+ buildDefinition.name;
      }

   
      if(buildDefinition.firmwareVersionId)
      {
        this.setState({printerManufacturerOptions: this.printerManufacturersByFirmwareVersion(buildDefinition.firmwareVersionId)});
        this.setState({printerMainboardOptions: this.mainboardOptionsByFirmware(buildDefinition.firmwareVersionId)});
      }

      console.log(buildDefinition.printerManufacturer);
      if(buildDefinition.printerManufacturer && this.state.printerManufacturerOptions)
      {
        this.setState({printerModelOptions: this.printerModelsByManufacturer(buildDefinition.printerManufacturer)});
      }

      if(buildDefinition.selectedMainboard)
      {
        this.setState({selectedMainboard: buildDefinition.selectedMainboard});
      }

      console.log(buildDefinition.printerModel);
      if(buildDefinition.printerModel && this.state.printerModelOptions)
      {
        this.setState({printerVariantOptions: this.printerVariantsByPrinterModel(buildDefinition.printerModel)});
        this.setState({platformioEnvOptions: this.platformioEnvOptionsByModel(buildDefinition.printerModel)});
        if(!buildDefinition.selectedMainboard)
          this.setState({selectedMainboard: this.selectedMainboardByModel(buildDefinition.printerModel)});
      }

      console.log(buildDefinition.printerMainboard);
      if(buildDefinition.printerMainboard && this.state.printerVariantOptions)
      {
        this.setState({platformioEnvOptions: this.platformioEnvOptionsByVariant(buildDefinition.printerMainboard)})
        if(!buildDefinition.selectedMainboard)
          this.setState({selectedMainboard: this.selectedMainboardByPrinterVariant(buildDefinition.printerMainboard)});
      }

      console.log(buildDefinition.platformioEnv);

      console.log(buildDefinition.configurationJSON);
      if(buildDefinition.configurationJSON)
      {
        var sanityCheckJson = JSON.parse(buildDefinition.configurationJSON);
        var lowerJsonObj = this.jsonLower(sanityCheckJson);
        var upgradedObj = this.upgradeJson(lowerJsonObj);
      }

      this.setState({
        id: buildDefinition.id,
        name: buildDefinition.name,
        firmwareVersionId: buildDefinition.firmwareVersionId,
        sourceTree: buildDefinition.sourceTree,
        configTree: buildDefinition.configTree,
        printerManufacturer: buildDefinition.printerManufacturer,
        printerModel: buildDefinition.printerModel,
        printerVariant: buildDefinition.printerMainboard,
        platformioEnv: buildDefinition.platformioEnv,
        description: buildDefinition.description,
        configurationJSON: JSON.stringify(upgradedObj, null, 3),
        sharedWithEveryone: this.state.clone ? undefined : buildDefinition.groupsCanAccess ? buildDefinition.groupsCanAccess.includes("Everyone") : undefined,
      });

      if(buildDefinition.printerMainboard && this.state.printerVariantOptions && this.state.printerVariantOptions.length===0)
      {
        this.setState({printerVariantSearch: buildDefinition.printerMainboard});
      }

      if(buildDefinition.platformioEnv && this.state.platformioEnvOptions && this.state.platformioEnvOptions.length===0)
      {
        this.setState({platformioEnvSearch: buildDefinition.platformioEnv});
      }


    } catch (error) {
      console.error(error);
    }
  }

  async componentDidMount()
  {
    console.info("componentDidMount");
    await this.fetchData();
  }
  
  handleSubmit = async(event) => {
      event.preventDefault();
      if(this.state.name === '')
      {
        alert("Name has to be filled")
        return false
      }
      let groupsCanAccess = this.state.sharedWithEveryone ? ["Everyone"] : [];
      let result;

      if(this.state.clone || !this.state.id || this.state.id === "")
      {
        result = await API.graphql(graphqlOperation(mutations.createBuildDefinition, {input: {
          name: this.state.name,
          firmwareVersionId: this.state.firmwareVersionId,
          sourceTree: this.state.sourceTree,
          configTree: this.state.configTree,
          printerManufacturer: this.state.printerManufacturer,
          printerModel: this.state.printerModel,
          printerMainboard: this.state.printerVariant,
          selectedMainboard: this.state.selectedMainboard,
          platformioEnv: this.state.platformioEnv,
          description: this.state.description,
          configurationJSON: this.state.configurationJSON,
          groupsCanAccess: groupsCanAccess          
        }}));
        console.log(result);
        console.log("ID : "+result.data.createBuildDefinition.id)
      }
      else 
      {
        result = await API.graphql(graphqlOperation(mutations.updateBuildDefinition, {input: {
          id:this.state.id, 
          name: this.state.name, 
          firmwareVersionId: this.state.firmwareVersionId,
          sourceTree: this.state.sourceTree,
          configTree: this.state.configTree,
          printerManufacturer: this.state.printerManufacturer ? this.state.printerManufacturer : this.state.printerManufacturerSearch,
          printerModel: this.state.printerModel, 
          printerMainboard: this.state.printerVariant, 
          selectedMainboard: this.state.selectedMainboard,
          platformioEnv:this.state.platformioEnv, 
          description: this.state.description, 
          configurationJSON: this.state.configurationJSON, 
          groupsCanAccess: groupsCanAccess
        }}));
      }
      if(result)
        this.props.history.push('/BuildDefinition');
      else
        console.error(result);
    }

  applySnippet(jsonSnippet){
    var json = JSON.parse(this.state.configurationJSON);
    var snippet = JSON.parse(jsonSnippet);
    if(!json['configformatversion'])
    {
      json.configformatversion = '2';
    }
    if(!json['headerfiles'])
    {
      json.headerfiles = [
        {
            "filename" : "Marlin/Configuration.h",
            "settings" : [
            ]
        },
        {
            "filename" : "Marlin/Configuration_adv.h",
            "settings" : [
            ]
        }
      ];
    }
    if(!snippet['headerfiles'])
      throw new Error("headerfiles section missing in snippet");
    
    json.headerfiles.forEach(headerfile => {
      var snippetQuery = snippet.headerfiles.filter(s=>s.filename === headerfile.filename); // does this section exist in snippet?
      if(snippetQuery.length>0)
      {
        var snippetSettings = snippetQuery[0]['settings'];
        var jsonSettings = headerfile.settings;

        snippetSettings.forEach(snippetSetting => {
          var found = false;
          jsonSettings.forEach(setting=>{
            if(setting.key===snippetSetting.key)
            {
              console.log("Found!");
              setting.enabled = snippetSetting.enabled;
              if(snippetSetting.value)
                setting.value = snippetSetting.value;
              found = true;
            }
          });
          if(!found)
          {
            console.log("Not found!");
            if(snippetSetting.value)
              jsonSettings.push({"key": snippetSetting.key, "enabled" : snippetSetting.enabled, "value": snippetSetting.value})
            else
              jsonSettings.push({"key": snippetSetting.key, "enabled" : snippetSetting.enabled})
          }
        });
      }
      console.log(json);
      return JSON.stringify(json, null, 3);
    });
    
    // finally
    this.setState({configurationJSON: JSON.stringify(json, null, 3)});
  }

  applySetting(headerFile, key, enabled, value=undefined)
  {
    var json = `
    {
      "headerfiles" : [
        {
            "filename" : "`+headerFile+`",
            "settings" : [
              {
                "key": "`+key+`",
                "enabled": "`+enabled+`"
                `+(value ? `, "value" : "`+value+`"` : null)+`
              }
            ]
        }
      ]
    }
    `;
    console.log(json);
    this.applySnippet(json);
  }

  handleTemplateClick(id){
    switch (id) {
      case 1:
        this.applySnippet(`
      {
        "headerfiles" : [
          {
              "filename" : "Marlin/Configuration.h",
              "settings" : [
                {
                  "key": "LEVEL_BED_CORNERS",
                  "enabled": "true"
                },
                {
                  "key": "SLIM_LCD_MENUS",
                  "enabled": "false"
                },
                {
                  "key": "LCD_BED_LEVELING",
                  "enabled": "true"
                },
                {
                  "key": "MESH_BED_LEVELING",
                  "enabled": "true"
                },
                {
                  "key": "GRID_MAX_POINTS_X",
                  "enabled": "true",
                  "value": "3"
                },
                {
                  "key": "GRID_MAX_POINTS_Y",
                  "enabled": "true",
                  "value": "3"
                }
              ]
          },
          {
              "filename" : "Marlin/Configuration_adv.h",
              "settings" : [
                {
                  "key": "ARC_SUPPORT",
                  "enabled": "false"
                }
              ]
          }
        ]
      }
        `);
        break;
    
      default:
        break;
    }
  }

  render() { return (
    <Grid divided>
      <Grid.Row>
        <Grid.Column width={7}>

      <Segment>
      <Form>
      <Header as='h3'>Edit build definition</Header>
      <Input
          type='text'
          label='Build Definition Name'
          placeholder='Build Definition Name'
          name='name'
          value={this.state.name}
          onChange={(e) => this.setState({name: e.target.value})}/>
      <br/>
      <Label>Firmware version</Label>
      <Dropdown
        placeholder='select firmware version'
        selection
        clearable
        options={this.state.firmwareOptions}
        value={this.state.firmwareVersionId}
        onChange={(e, {value}) => {
          this.setState({firmwareVersionId: value})
          this.setState({printerManufacturerOptions: this.printerManufacturersByFirmwareVersion(value)});
          this.setState({printerMainboardOptions: this.mainboardOptionsByFirmware(value)})
          }}/>
      <br/>
      
      { this.state.firmwareVersionId ? null : <>
      <Input
          label='Source tree URL'
          type='text'
          placeholder='Source tree URL'
          name='sourceTree'
          value={this.state.sourceTree}
          onChange={(e) => this.setState({sourceTree: e.target.value})}
          disabled={this.state.firmwareVersionId?true:false}
      /><br/>
      <Input
          type='text'
          label='Config tree URL'
          placeholder='Config tree URL'
          name='configTree'
          value={this.state.configTree}
          onChange={(e) => this.setState({configTree: e.target.value})}
          disabled={this.state.firmwareVersionId?true:false}
      /><br/> </> }

      <Label>Printer Manufacturer</Label>
      <Dropdown
        clearable
        onChange={(e, { searchQuery, value}) => {
          this.setState({printerManufacturerSearch: "", printerManufacturer: value});
          console.log(value);
          this.setState({printerModelOptions: this.printerModelsByManufacturer(value)});
        }}
        onSearchChange={(e, {searchQuery}) => this.setState({printerManufacturerSearch: searchQuery})}
        options={this.state.printerManufacturerOptions}
        placeholder='Select printer manufacturer'
        name='printerManufacturer'
        id='printerManufacturer'
        search
        searchQuery={this.state.printerManufacturerSearch}
        selection
        value={this.state.printerManufacturer}
      />      
      
      <br/>

      <Label>Printer Model</Label>
      <Dropdown
        clearable
        onChange={(e, { searchQuery, value}) => {
          this.setState({printerModelSearch: "", printerModel: value});
          console.log(value);
          this.setState({printerVariantOptions: this.printerVariantsByPrinterModel(value)});
          this.setState({platformioEnvOptions: this.platformioEnvOptionsByModel(value)});
          this.setState({selectedMainboard: this.selectedMainboardByModel(value)});
        }}
        onSearchChange={(e, {searchQuery}) => this.setState({printerModelSearch: searchQuery})}
        options={this.state.printerModelOptions}
        placeholder='Select printer model'
        name='printerModel'
        search
        searchQuery={this.state.printerModelSearch}
        selection
        value={this.state.printerModel}
      />

      <br/>
      <Label>Printer Variant / Preset</Label>
      <Dropdown
        clearable
        onChange={(e, { searchQuery, value}) => {
          this.setState({printerVariantSearch: "", printerVariant: value});
          // filter subsequent list accordingly
          console.log(value);
          this.setState({platformioEnvOptions: this.platformioEnvOptionsByVariant(value)})
          this.setState({selectedMainboard: this.selectedMainboardByPrinterVariant(value)});
        }}
        onSearchChange={(e, {searchQuery}) => this.setState({printerVariantSearch: searchQuery})}
        options={this.state.printerVariantOptions}
        placeholder='Select Printer Variant / Preset'
        name='printervariant'
        search
        searchQuery={this.state.printerVariantSearch}
        selection
        value={this.state.printerVariant}
      />
      <br/>
      <Label>Selected Mainboard</Label>
      <Dropdown
        clearable
        onChange={(e, { searchQuery, value}) => {
          this.setState({printerMainboardSearch: "", selectedMainboard: value});
          //var newConfig = this.setHeaderFileConfigValue(this.state.configurationJSON, "Marlin/Configuration.h", "MOTHERBOARD", value);
          //this.setState({configurationJSON: newConfig});
          this.applySetting("Marlin/Configuration.h", "MOTHERBOARD", true, value);
        }}
        onSearchChange={(e, {searchQuery}) => this.setState({printerMainboardSearch: searchQuery})}
        options={this.state.printerMainboardOptions}
        placeholder='Select mainboard option'
        name='printermainboard'
        search
        selection
        value={this.state.selectedMainboard}
      />
      <br/>

      <Label>PlatformIO environment</Label>
      <Dropdown
        clearable
        onChange={(e, { searchQuery, value}) => {
          this.setState({platformioEnvSearch: "", platformioEnv: value});
          // filter subsequent list accordingly
        }}
        onSearchChange={(e, {searchQuery}) => this.setState({platformioEnvSearch: searchQuery})}
        options={this.state.platformioEnvOptions}
        placeholder='Select PlatformIO environment'
        name='platformioenv'
        search
        searchQuery={this.state.platformioEnvSearch}
        selection
        value={this.state.platformioEnv}
      /><br/>        
      <Label>Description</Label>
      <TextareaAutosize
          label='Description'
          placeholder='Description'
          name='description'
          value={this.state.description}
          onChange={(e) => this.setState({description: e.target.value})}
      /><br/>
      <Label>Config JSON</Label>
      <AceEditor
        mode="json"
        theme="github"
        value={this.state.configurationJSON}
        onChange={(e) => this.setState({configurationJSON: e})}
        name="UNIQUE_ID_OF_DIV"
        fontSize={14}
        showPrintMargin={true}
        showGutter={true}
        highlightActiveLine={true}
        width="100%"
        editorProps={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: false,
          showLineNumbers: true,
          tabSize: 2,
          }}
      /><br/>      
			{ this.state.isAdmin ? <>
			<Input 
          type='Checkbox'
          label='Shared with everyone'
          name='sharedWithEveryone'
          checked={this.state.sharedWithEveryone}
          onChange={(e)=>this.setState({sharedWithEveryone: e.target.checked})}
          >
      </Input><br/><br/>
			</> : null }
      <Button
          content='Save'
          onClick={(e)=>this.handleSubmit(e)}
      />
      <Route render={({history}) => (
          <Button onClick={()=>history.push('/BuildDefinition')}>     
              Cancel            
          </Button>
      )}/>        
      </Form>
      </Segment>
    </Grid.Column>
    <Grid.Column width={5}>
      <Segment>
        <Header>Templates</Header>
        <Button onClick={(e)=>this.handleTemplateClick(1)}>Manual Mesh Bed Leveling (3x3), no probe</Button>
      </Segment>
    </Grid.Column>
    </Grid.Row>
  </Grid>      

      );
  }
}