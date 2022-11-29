import { useState, useEffect } from 'react'
import { API, graphqlOperation, Auth } from 'aws-amplify'
import { useParams, useNavigate } from 'react-router-dom'
import {
    Header, 
    Input, 
    Segment, 
    Button,
    Form,
    Label,
    Dropdown, 
    Grid,
    Message
  } from 'semantic-ui-react'
import TextareaAutosize from 'react-textarea-autosize';

import * as queries from '../graphql/queries'
import * as mutations from '../graphql/mutations'
import * as customqueries from '../graphql/customqueries'


import AceEditor from "react-ace";
import 'ace-builds/webpack-resolver'
import("ace-builds/src-min-noconflict/ext-language_tools");

const env = process.env["REACT_APP_ENV"];
function isDev() { return env.startsWith("dev")}

const defaultJson = JSON.stringify(JSON.parse(`
{
  "configformatversion" : "2",
  "headerfiles" : [
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
  ],
  "inifiles" : [
  ]
}
`), null, 3);

function EditBuildDefinition({isAdmin, clone, authState}) {

  let navigate = useNavigate();
  const params = useParams();
  //console.log("PARAMS: ", params);

  const [id, setId] = useState(params.id ? params.id : "");
  console.log("Id "+id);
	console.log("IsAdmin "+isAdmin);
  console.log("Clone "+clone);
  console.log("authState "+authState);
  const [name, setName] = useState('');
  const [firmwareVersionId, setFirmwareVersionId] = useState(undefined);
  const [sourceTree, setSourceTree] = useState('');
  const [configTree, setConfigTree] = useState('');
  const [printerManufacturer, setPrinterManufacturer] = useState('');
  const [printerModel, setPrinterModel] = useState('');
  const [printerVariant, setPrinterVariant] = useState('');
  const [platformioEnv, setPlatformioEnv] = useState('');
  const [description, setDescription] = useState('');
  const [configurationJSON, setConfigurationJSON] = useState(defaultJson);
  const [sharedWithEveryone, setSharedWithEveryone] = useState(false);
  const [firmwareVersionOptions, setFirmwareOptions] = useState([]);
  const [printerManufacturerSearch, setPrinterManufacturerSearch] = useState('');
  const [printerManufacturerOptions, setPrinterManufacturerOptions] = useState([]);
  const [printerModelSearch, setPrinterModelSearch] = useState('');
  const [printerModelOptions, setPrinterModelOptions] = useState([]);
  const [printerVariantSearch, setPrinterVariantSearch] = useState('');
  const [printerVariantOptions, setPrinterVariantOptions] = useState([]);
  const [platformioEnvSearch, setPlatformioEnvSearch] = useState('');
  const [platformioEnvOptions, setPlatformioEnvOptions] = useState([]);
  const [printerMainboardOptions, setPrinterMainboardOptions] = useState([]);
  const [selectedMainboard, setSelectedMainboard] = useState(undefined);
  const [printerMainboardSearch, setPrinterMainboardSearch] = useState('');
  const [jsonErrors, setJsonErrors] = useState([]);

  function printerManufacturersByFirmwareVersion(options, id)
  {
    if(!id) return [];
    var jsonList = options.filter(f=>f.key === id)
    if(jsonList.length>0) // has config json
    { 
       var json = jsonList[0]['defaultconfigjson'];
       if(isDev())console.log(json);
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

  function printerModelsByManufacturer(printerManufacturerOptions, value)
  {
      if(!value) return [];
      var printerManuOptions = printerManufacturerOptions.filter(f=>f.value === value);
      if(printerManuOptions.length===0)
      {
         return [];
      }
      var firstPrinterManuOption = printerManuOptions[0];
      if(isDev())console.log(firstPrinterManuOption);
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

  function printerVariantsByPrinterModel(modelOptions, value)
  {
    if(!value) return [];
    var printerVariantsList = modelOptions.filter(f=>f.key === value);
    if(printerVariantsList.length>0)
    {
       if(isDev())console.log(printerVariantsList);
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

  function platformioEnvOptionsByVariant(variantOptions, value)
  {
    if(!value) return [];
    var printerVariantsList = variantOptions.filter(f=>f.key === value);
    if(printerVariantsList.length>0)
    {
      if(isDev())console.log(printerVariantsList);
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

  function selectedMainboardByPrinterVariant(variantOptions, value)
  {
    if(!value) return [];
    var printerVariantsList = variantOptions.filter(f=>f.key === value);
    if(printerVariantsList.length>0)
    {
      return printerVariantsList[0]['mainboard'];
    }
  }

  function platformioEnvOptionsByModel(modelOptions, value)
  {
    if(!value) return [];
    var filteredList = modelOptions.filter(f=>f.key === value);
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

  function platformioEnvOptionsByMotherboard(mainboardOptions, value)
  {
    if(!value) return [];
    var filteredList = mainboardOptions.filter(f=>f.key === value);
    if(filteredList.length>0)
    {
      if(isDev())console.log(filteredList);
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

  function selectedMainboardByModel(modelOptions, value)
  {
    if(!value) return [];
    var filteredList = modelOptions.filter(f=>f.key === value);
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

  function mainboardOptionsByFirmwareVersion(firmwareVersionOptions, id)
  {
    if(!id) return [];
    var jsonList = firmwareVersionOptions.filter(f=>f.key === id)
    if(jsonList.length>0) // has config json
    { 
      var json = jsonList[0]['defaultconfigjson'];
      if(isDev())console.log(json);
      if(json)
      {
        var jsonObj = JSON.parse(json);
        var result = jsonObj['mainboards'].sort((a,b)=>a.boardName > b.boardName ? 1 : -1).map(v=>{
            return {
              key: v.boardName,
              text: v.boardDescription,
              value: v.boardName,
              environments: v.boardEnvironments
            }
          });
        return result;
      }
    }
  }

  function jsonLower(obj)
  {
    var ret = null;
      if (typeof(obj) == "string" || typeof(obj) == "number")
          return obj;
      else if (obj.push)
          ret = [];
      else
          ret = {};
      for (var key in obj)
          ret[String(key).toLowerCase()] = jsonLower(obj[key]);
      return ret;
  };

  function upgradeJson(json)
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

  const fetchData = async () => {
    try {
      console.log("fetchData");
      const firmwareResult = await API.graphql(graphqlOperation(queries.listFirmwareVersions))
      const firmwareOptions = firmwareResult.data.listFirmwareVersions.items.sort((a,b)=>a.name > b.name ? 1 : -1).map(v=>{return {
        key: v.id,
        text: v.name,
        value: v.id,
        defaultconfigjson: v.defaultConfigJson,
        mainboards: v.mainboards
      }})
      setFirmwareOptions(firmwareOptions);
      if(!id || id === "")
        return;

      const result = await API.graphql(graphqlOperation(queries.getBuildDefinition, {id: id}));
      const buildDefinition = result.data.getBuildDefinition
      console.log(buildDefinition);

      if(clone)
      {
        buildDefinition.name = "(Copy of) "+ buildDefinition.name;
      }

      setId(buildDefinition.id);
      setName(buildDefinition.name);
      setSourceTree(buildDefinition.sourceTree);
      setConfigTree(buildDefinition.configTree);

      console.log("Firmware version: "+buildDefinition.firmwareVersionId);
      if(buildDefinition.firmwareVersionId)
      {
        var localPrinterManufacturerOptions = printerManufacturersByFirmwareVersion(firmwareOptions, buildDefinition.firmwareVersionId)
        console.log("Printer manufacturer options: ", localPrinterManufacturerOptions);
        setPrinterManufacturerOptions(localPrinterManufacturerOptions);
        var localPrinterMainboardOptions = mainboardOptionsByFirmwareVersion(firmwareOptions, buildDefinition.firmwareVersionId);
        setPrinterMainboardOptions(localPrinterMainboardOptions);
      }

      console.log("Printer manufacturer: ", buildDefinition.printerManufacturer);
      console.log("Printer manufacturer options: ", localPrinterManufacturerOptions);
      if(buildDefinition.printerManufacturer && localPrinterManufacturerOptions)
      {
        console.log("populating list of printer models")
        var localPrinterModelsByManufacturer = printerModelsByManufacturer(localPrinterManufacturerOptions, buildDefinition.printerManufacturer)
        setPrinterModelOptions(localPrinterModelsByManufacturer);
      }

      console.log("Printer model: ", buildDefinition.printerModel);
      var localPlatformioEnvOptions;
      if(buildDefinition.printerModel && localPrinterModelsByManufacturer)
      {
        var localPrinterVariantOptions = printerVariantsByPrinterModel(localPrinterModelsByManufacturer, buildDefinition.printerModel);
        setPrinterVariantOptions(localPrinterVariantOptions);
        localPlatformioEnvOptions = platformioEnvOptionsByModel(localPrinterModelsByManufacturer, buildDefinition.printerModel);
        setPlatformioEnvOptions(localPlatformioEnvOptions);
        if(!buildDefinition.selectedMainboard)
          setSelectedMainboard(selectedMainboardByModel(localPrinterModelsByManufacturer, buildDefinition.printerModel));
      }

      console.log(buildDefinition.printerMainboard);
      if(buildDefinition.printerMainboard && localPrinterVariantOptions)
      {
        setPlatformioEnvOptions(platformioEnvOptionsByVariant(localPrinterVariantOptions, buildDefinition.printerMainboard))
        if(!buildDefinition.selectedMainboard)
          setSelectedMainboard(selectedMainboardByPrinterVariant(localPrinterVariantOptions, buildDefinition.printerMainboard));
      }

      console.log(buildDefinition.platformioEnv);

      if(isDev())console.log(buildDefinition.configurationJSON);
      if(buildDefinition.configurationJSON)
      {
        try {
          var sanityCheckJson = JSON.parse(buildDefinition.configurationJSON);
          var lowerJsonObj = jsonLower(sanityCheckJson);
          var upgradedObj = upgradeJson(lowerJsonObj);
          } catch (error) {
          // error in json, continue without parsing
        }
      }

      setFirmwareVersionId(buildDefinition.firmwareVersionId);
      setPrinterManufacturer(buildDefinition.printerManufacturer);
      setPrinterModel(buildDefinition.printerModel);
      setPrinterVariant(buildDefinition.printerMainboard);
      setPlatformioEnv(buildDefinition.platformioEnv);
      setDescription(buildDefinition.description);
      setConfigurationJSON(upgradedObj ? JSON.stringify(upgradedObj, null, 3) : buildDefinition.configurationJSON);
      setSharedWithEveryone(clone ? undefined : buildDefinition.groupsCanAccess ? buildDefinition.groupsCanAccess.includes("Everyone") : undefined);

      if(buildDefinition.printerMainboard && localPrinterVariantOptions && localPrinterVariantOptions.length===0)
      {
        setPrinterVariantSearch(buildDefinition.printerMainboard);
      }

      if(buildDefinition.selectedMainboard)
      {
        setSelectedMainboard(buildDefinition.selectedMainboard);
        localPlatformioEnvOptions = platformioEnvOptionsByMotherboard(localPrinterMainboardOptions, buildDefinition.selectedMainboard);
        setPlatformioEnvOptions(localPlatformioEnvOptions);
      }

      if(buildDefinition.platformioEnv && localPlatformioEnvOptions && localPlatformioEnvOptions.length===0)
      {
        setPlatformioEnvSearch(buildDefinition.platformioEnv);
      }

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(()=> {
    if(!authState)
    {
      navigate("/login");
    }
    fetchData();
  }, []);
  
  async function handleSubmit(event) {
      event.preventDefault();
      if(name === '')
      {
        alert("Name has to be filled")
        return false
      }
      let groupsCanAccess = sharedWithEveryone ? ["Everyone"] : [];
      let result;

      if(clone || !id || id === "")
      {
        const user =  await Auth.currentAuthenticatedUser();
        const countresult = await API.graphql(graphqlOperation(customqueries.listBuildDefinitionsWithJobs, {limit: 999, 
          filter: {
            owner : {
              eq : user.username
            }
          }
        }));
        var items = countresult.data.listBuildDefinitions.items
        console.log("Items:",items.length);
        if(!isAdmin && params.patronLevel<=1 && items.length>=1)
        {
          alert("You may only hav one custom build definition. You can increase the limit by becoming a Patron on Padawan level.");
          return false;
        }

        result = await API.graphql(graphqlOperation(mutations.createBuildDefinition, {input: {
          name: name,
          firmwareVersionId: firmwareVersionId,
          sourceTree: sourceTree,
          configTree: configTree,
          printerManufacturer: printerManufacturer,
          printerModel: printerModel,
          printerMainboard: printerVariant,
          selectedMainboard: selectedMainboard,
          platformioEnv: platformioEnv,
          description: description,
          configurationJSON: configurationJSON,
          groupsCanAccess: groupsCanAccess          
        }}));
        console.log(result);
        console.log("ID : "+result.data.createBuildDefinition.id)
      }
      else 
      {
        result = await API.graphql(graphqlOperation(mutations.updateBuildDefinition, {input: {
          id:id, 
          name: name, 
          firmwareVersionId: firmwareVersionId,
          sourceTree: sourceTree,
          configTree: configTree,
          printerManufacturer: printerManufacturer ? printerManufacturer : printerManufacturerSearch,
          printerModel: printerModel, 
          printerMainboard: printerVariant, 
          selectedMainboard: selectedMainboard,
          platformioEnv:platformioEnv, 
          description: description, 
          configurationJSON: configurationJSON, 
          groupsCanAccess: groupsCanAccess
        }}));
      }
      if(result)
        navigate('/BuildDefinition');
      else
        console.error(result);
    }

  function applySnippet(jsonSnippet){
    var json = JSON.parse(configurationJSON);
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
    setConfigurationJSON(JSON.stringify(json, null, 3));
  }

  function applySetting(headerFile, key, enabled, value=undefined)
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
    applySnippet(json);
  }

  function handleTemplateClick(id){
    switch (id) {
      case 1:
        applySnippet(`
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
                  "key": "AUTO_BED_LEVELING_BILINEAR",
                  "enabled": "false"
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
      case 2:
        applySnippet(`
        {
          "configformatversion": "2",
          "headerfiles": [
             {
                "filename": "Marlin/Configuration.h",
                "settings": [
                   {
                      "key": "MESH_BED_LEVELING",
                      "enabled": "false"
                   },
                   {
                      "key": "AUTO_BED_LEVELING_BILINEAR",
                      "enabled": "true"
                   },
                   {
                      "key": "BLTOUCH",
                      "enabled": "true"
                   },
                   {
                      "key": "NOZZLE_TO_PROBE_OFFSET",
                      "enabled": "true",
                      "value": "{ 10, 10, 0 }",
                      "comment": "TODO measure correct offset"
                   },
                   {
                      "key": "PROBING_MARGIN",
                      "enabled": "true",
                      "value": "20"
                   },
                   {
                      "key": "GRID_MAX_POINTS_X",
                      "enabled": "true",
                      "value": "4"
                   },
                   {
                      "key": "EXTRAPOLATE_BEYOND_GRID",
                      "enabled": "true"
                   },
                   {
                      "key": "LCD_BED_LEVELING",
                      "enabled": "true"
                   },
                   {
                      "key": "LEVEL_BED_CORNERS",
                      "enabled": "true"
                   },
                   {
                      "key": "Z_SAFE_HOMING",
                      "enabled": "true"
                   },
                   {
                     "key": "USE_PROBE_FOR_Z_HOMING",
                     "enabled": "true"
                   },
                   {
                       "key": "Z_MIN_PROBE_USES_Z_MIN_ENDSTOP_PIN",
                       "enabled": "false",
                       "comment": "Disabled if mainboard has dedicated probe/servo port, enabled if sensor is plugged into z-endstop port"
                      },                   
                   {
                      "key": "MULTIPLE_PROBING",
                      "enabled": "true",
                      "value": "2"
                   },
                   {
                      "key": "Z_MIN_PROBE_REPEATABILITY_TEST",
                      "enabled": "true"
                   },
                   {
                      "key": "HOME_AFTER_DEACTIVATE",
                      "enabled": "true"
                   },
                   {
                      "key": "RESTORE_LEVELING_AFTER_G28",
                      "enabled": "true"
                   }
                ]
             },
             {
                "filename": "Marlin/Configuration_adv.h",
                "settings": [
                ]
             }
          ],
          "inifiles": []
       }
        `);
        break;
      case 3:
        applySnippet(`
        {
          "configformatversion": "2",
          "headerfiles": [
             {
                "filename": "Marlin/Configuration.h",
                "settings": [
                   {
                      "key": "NOZZLE_PARK_FEATURE",
                      "enabled": "true"
                   },
                   {
                      "key": "FILAMENT_RUNOUT_SENSOR",
                      "enabled": "true"
                   }
                ]
             },
             {
                "filename": "Marlin/Configuration_adv.h",
                "settings": [
                  {
                    "key": "ADVANCED_PAUSE_FEATURE",
                    "enabled": "true"
                  }                  
                ]
             }
          ],
          "inifiles": []
       }
        `);
        break;
      case 4:
        applySnippet(`
        {
          "headerfiles" : [
            {
                "filename" : "Marlin/Configuration.h",
                "settings" : [
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
      case 5:
        applySnippet(`
        {
          "headerfiles" : [
            {
                "filename" : "Marlin/Configuration.h",
                "settings" : [
                  {
                    "key": "SLIM_LCD_MENUS",
                    "enabled": "true"
                  }                ]
            },
            {
                "filename" : "Marlin/Configuration_adv.h",
                "settings" : [
                  {
                    "key": "ARC_SUPPORT",
                    "enabled": "false"
                  },
                  {
                    "key": "SDCARD_READONLY",
                    "enabled": "true"
                  },
                  {
                    "key": "DISABLE_M503",
                    "enabled": "true"
                  },
                  {
                    "key": "NO_VOLUMETRICS",
                    "enabled": "true"
                  },
                  {
                    "key": "NO_WORKSPACE_OFFSETS",
                    "enabled": "true"
                  }
                ]
            }
          ]
        }
        `);
        break;    
        case 6:
          applySnippet(`
          {
            "configformatversion": "2",
            "headerfiles": [
               {
                  "filename": "Marlin/Configuration.h",
                  "settings": [
                     {
                        "key": "MESH_BED_LEVELING",
                        "enabled": "false"
                     },
                     {
                        "key": "AUTO_BED_LEVELING_BILINEAR",
                        "enabled": "true"
                     },
                     {
                        "key": "BLTOUCH",
                        "enabled": "true"
                     },
                     {
                        "key": "NOZZLE_TO_PROBE_OFFSET",
                        "enabled": "true",
                        "value": "{ 10, 10, 0 }",
                        "comment": "TODO measure correct offset"
                     },
                     {
                        "key": "PROBING_MARGIN",
                        "enabled": "true",
                        "value": "20"
                     },
                     {
                        "key": "GRID_MAX_POINTS_X",
                        "enabled": "true",
                        "value": "4"
                     },
                     {
                        "key": "EXTRAPOLATE_BEYOND_GRID",
                        "enabled": "true"
                     },
                     {
                        "key": "LCD_BED_LEVELING",
                        "enabled": "true"
                     },
                     {
                        "key": "LEVEL_BED_CORNERS",
                        "enabled": "true"
                     },
                     {
                        "key": "Z_SAFE_HOMING",
                        "enabled": "true"
                     },
                     {
                        "key": "DEFAULT_MAX_FEEDRATE",
                        "enabled": "true",
                        "value": "{ 500, 500, 20, 25 }"
                     },
                     {
                       "key": "USE_PROBE_FOR_Z_HOMING",
                       "enabled": "true"
                     },
                     {
                         "key": "Z_MIN_PROBE_USES_Z_MIN_ENDSTOP_PIN",
                         "enabled": "false",
                         "comment": "Disabled if mainboard has dedicated probe/servo port, enabled if sensor is plugged into z-endstop port"
                     },
                     {
                        "key": "XY_PROBE_FEEDRATE",
                        "enabled": "true",
                        "value": "(150*60)"
                     },
                     {
                        "key": "Z_PROBE_FEEDRATE_FAST",
                        "enabled": "true",
                        "value": "(6*60)"
                     },
                     {
                        "key": "MULTIPLE_PROBING",
                        "enabled": "true",
                        "value": "2"
                     },
                     {
                        "key": "Z_MIN_PROBE_REPEATABILITY_TEST",
                        "enabled": "true"
                     },
                     {
                        "key": "HOME_AFTER_DEACTIVATE",
                        "enabled": "true"
                     },
                     {
                        "key": "RESTORE_LEVELING_AFTER_G28",
                        "enabled": "true"
                     },
                     {
                        "key": "HOMING_FEEDRATE_MM_M",
                        "enabled": "true",
                        "value": "{ (150*60), (150*60), (6*60) }"
                     }
                  ]
               },
               {
                  "filename": "Marlin/Configuration_adv.h",
                  "settings": [
                    {
                      "key": "BLTOUCH_DELAY",
                      "enabled": "true",
                      "value": "300"
                   },                    
                     {
                        "key": "BLTOUCH_HS_MODE",
                        "enabled": "true"
                     }
                  ]
               }
            ],
            "inifiles": []
         }
          `);
          break;
        default:
        break;
    }
  }

  return (
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
          value={name}
          onChange={(e) => setName(e.target.value)}/>
      <br/>
      <Label>Firmware version</Label>
      <Dropdown
        placeholder='select firmware version'
        selection
        clearable
        options={firmwareVersionOptions}
        value={firmwareVersionId}
        onChange={(e, {value}) => {
          setFirmwareVersionId(value);
          setPrinterManufacturerOptions(printerManufacturersByFirmwareVersion(firmwareVersionOptions, value));
          setPrinterMainboardOptions(mainboardOptionsByFirmwareVersion(firmwareVersionOptions, value))
          }}/>
      <br/>
      
      { firmwareVersionId ? null : <>
      <Input
          label='Source tree URL'
          type='text'
          placeholder='Source tree URL'
          name='sourceTree'
          value={sourceTree}
          onChange={(e) => setSourceTree(e.target.value)}
          disabled={firmwareVersionId?true:false}
      /><br/>
      <Input
          type='text'
          label='Config tree URL'
          placeholder='Config tree URL'
          name='configTree'
          value={configTree}
          onChange={(e) => setConfigTree(e.target.value)}
          disabled={firmwareVersionId?true:false}
      /><br/> </> }

      <Label>Printer Manufacturer</Label>
      <Dropdown
        clearable
        onChange={(e, { searchQuery, value}) => {
          setPrinterManufacturerSearch("");
          setPrinterManufacturer(value);
          console.log(value);
          setPrinterModelOptions(printerModelsByManufacturer(printerManufacturerOptions, value));
        }}
        onSearchChange={(e, {searchQuery}) => setPrinterManufacturerSearch(searchQuery)}
        options={printerManufacturerOptions}
        placeholder='Select printer manufacturer'
        name='printerManufacturer'
        id='printerManufacturer'
        search
        searchQuery={printerManufacturerSearch}
        selection
        value={printerManufacturer}
      />      
      
      <br/>

      <Label>Printer Model</Label>
      <Dropdown
        clearable
        onChange={(e, { searchQuery, value}) => {
          setPrinterModelSearch("");
          setPrinterModel(value);
          console.log(value);
          setPrinterVariantOptions(printerVariantsByPrinterModel(printerModelOptions, value));
          setPlatformioEnvOptions(platformioEnvOptionsByModel(printerModelOptions, value));
          setSelectedMainboard(selectedMainboardByModel(printerModelOptions, value));
        }}
        onSearchChange={(e, {searchQuery}) => setPrinterModelSearch(searchQuery)}
        options={printerModelOptions}
        placeholder='Select printer model'
        name='printerModel'
        search
        searchQuery={printerModelSearch}
        selection
        value={printerModel}
      />

      <br/>
      <Label>Printer Variant / Preset</Label>
      <Dropdown
        clearable
        onChange={(e, { searchQuery, value}) => {
          setPrinterVariantSearch("");
          setPrinterVariant(value);
          // filter subsequent list accordingly
          console.log(value);
          setPlatformioEnvOptions(platformioEnvOptionsByVariant(printerVariantOptions, value))
          setSelectedMainboard(selectedMainboardByPrinterVariant(printerVariantOptions, value));
        }}
        onSearchChange={(e, {searchQuery}) => setPrinterVariantSearch(searchQuery)}
        options={printerVariantOptions}
        placeholder='Select Printer Variant / Preset'
        name='printervariant'
        search
        searchQuery={printerVariantSearch}
        selection
        value={printerVariant}
      />
      <br/>
      <Label>Selected Mainboard</Label>
      <Dropdown
        clearable
        onChange={(e, { searchQuery, value}) => {
          setPrinterMainboardSearch("");
          setSelectedMainboard(value);
          applySetting("Marlin/Configuration.h", "MOTHERBOARD", true, value);
          setPlatformioEnvOptions(platformioEnvOptionsByMotherboard(printerMainboardOptions, value))
        }}
        onSearchChange={(e, {searchQuery}) => setPrinterMainboardSearch(searchQuery)}
        options={printerMainboardOptions}
        placeholder='Select mainboard option'
        name='printermainboard'
        search
        selection
        value={selectedMainboard}
      />
      <br/>

      <Label>PlatformIO environment</Label>
      <Dropdown
        clearable
        onChange={(e, { searchQuery, value}) => {
          setPlatformioEnvSearch("");
          setPlatformioEnv(value);
          // filter subsequent list accordingly
        }}
        onSearchChange={(e, {searchQuery}) => setPlatformioEnvSearch(searchQuery)}
        options={platformioEnvOptions}
        placeholder='Select PlatformIO environment'
        name='platformioenv'
        search
        searchQuery={platformioEnvSearch}
        selection
        value={platformioEnv}
      /><br/>        
      <Label>Description</Label>
      <TextareaAutosize
          label='Description'
          placeholder='Description'
          name='description'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
      /><br/>
      { jsonErrors.length>0 ? 
      <Message negative header='You have some error(s) in your config JSON. Please fix before building.' list={jsonErrors} />
      : null }
      <Label>Config JSON</Label>
      <AceEditor
        mode="json"
        theme="github"
        value={configurationJSON}
        onChange={(e) => setConfigurationJSON(e)}
        onValidate= {(annotations) => {
          if(isDev())console.log(annotations);
          var errorList = [];
          annotations.forEach(element => {
            errorList.push("Row: "+element.row+", Col: "+element.column+": "+element.text);
          });
          setJsonErrors(errorList)
        }}
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
			{ isAdmin ? <>
			<Input 
          type='Checkbox'
          label='Shared with everyone'
          name='sharedWithEveryone'
          checked={sharedWithEveryone}
          onChange={(e)=>setSharedWithEveryone(e.target.checked)}
          >
      </Input><br/><br/>
			</> : null }
      <Button
          content='Save'
          onClick={(e)=>handleSubmit(e)}
      />
      <Button onClick={()=>navigate('/BuildDefinition')}>     
          Cancel            
      </Button>
      </Form>
      </Segment>
    </Grid.Column>
    <Grid.Column width={5}>
      <Segment>
        <Header>Templates</Header>
        <Header as="h4">Bed Leveling</Header>
        <Button onClick={(e)=>handleTemplateClick(1)}>Manual Mesh Bed Leveling (3x3), no probe</Button><br/><br/>
        <Button onClick={(e)=>handleTemplateClick(2)}>Auto Bed Leveling (4x4), BLTouch</Button><br/><br/>
        <Button onClick={(e)=>handleTemplateClick(6)}>Auto Bed Leveling (4x4), BLTouch high speed probing</Button>
        <Header as="h4">Filament Sensor</Header>
        <Button onClick={(e)=>handleTemplateClick(3)}>Filament Sensor, default settings</Button>
        <Header as="h4">Memory Optimizations (for 8 Bit boards)</Header>
        <Button onClick={(e)=>handleTemplateClick(4)}>Save program memory, normal</Button>
        <p>This setting disables ARC_SUPPORT and saves quite a bit of program memory.</p>
        <Button onClick={(e)=>handleTemplateClick(5)}>Save program memory, aggressive</Button>
        <p>This setting very aggressively saves memory and removes a lot of features like the M503 command, M428 and volumetric extrusion.</p>
      </Segment>
    </Grid.Column>
    </Grid.Row>
  </Grid>      

  );
}

export default EditBuildDefinition;