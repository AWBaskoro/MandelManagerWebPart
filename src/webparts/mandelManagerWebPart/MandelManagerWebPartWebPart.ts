import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './MandelManagerWebPartWebPart.module.scss';
import * as strings from 'MandelManagerWebPartWebPartStrings';
import 'jquery';
import * as bootstrap from 'bootstrap';
import 'moment';
import 'fullcalendar';
import 'fullcalendar-scheduler';
import { SPComponentLoader } from '@microsoft/sp-loader'

export interface IMandelManagerWebPartWebPartProps {
  description: string;
}

export default class MandelManagerWebPartWebPart extends BaseClientSideWebPart<IMandelManagerWebPartWebPartProps> {

  public constructor() {
    super();
    SPComponentLoader.loadCss('../node_modules/bootstrap/dist/css/bootstrap.css');
    SPComponentLoader.loadCss('../node_modules/fullcalendar/dist/fullcalendar.css')
    SPComponentLoader.loadCss('../node_modules/fullcalendar-scheduler/dist/scheduler.css')
  }

  public render(): void {
    this.domElement.innerHTML = `
    <div id="popInfo" class="hide">
    <table class="table">
        <tr>
            <td>Start Date</td>
            <td>:</td>
            <td>
                <label for="pop_startDate" />
            </td>
        </tr>
        <tr>
            <td>End Date</td>
            <td>:</td>
            <td>
                <label for="pop_endDate" />
            </td>
        </tr>

        <tr>
            <td>Trainer</td>
            <td>:</td>
            <td>
                <label for="pop_trainer" />
            </td>
        </tr>
        <tr>
            <td>Subject</td>
            <td>:</td>
            <td>
                <label for="pop_subject" />
            </td>
        </tr>
    </table>
</div>

    <div id="calendar"></div>
    <div id="AddEvt" class="hide" >
      <table class="table" border="0">
        <tr>
          <td>Start Date</td>
          <td>:</td>
          <td>
          <label for="start_date" />
          </td>
        </tr>
        <tr>
          <td>End Date</td>
          <td>:</td>
          <td>
          <label for="end_date" />
          </td>
        </tr>
        <tr>
          <td>Event</td>
          <td>:</td>
          <td>
          <input type="text" id="tbEvent" />
          </td>
        </tr>
        <tr>
         <td>Trainer</td>
         <td>:</td>
         <td>
          <input type="text" id="tbTrainer" />
         </td>
        </tr>
        <tr>
          <td>Subject</td>
          <td>:</td>
          <td>
            <input type="text" id="tbSubject" />
          </td>
       </tr>
        <tr>
          <td colspan="3">
            <button id="btnAddEvt" onClick="AddNewEvent()"  Text="Add Event" class="btn btn-xs">Add Event</button>
          </td>
        </tr>
      </table>
      </div>
   
    `;

    (window as any).webAbsoluteUrl = this.context.pageContext.web.absoluteUrl;
    require('./scriptcalendar');
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
