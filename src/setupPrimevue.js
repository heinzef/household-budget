import MultiSelect from 'primevue/multiselect';
import Dropdown from 'primevue/dropdown';
import Divider from 'primevue/divider';
import Avatar from 'primevue/avatar';
import ColorPicker from 'primevue/colorpicker';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Checkbox from 'primevue/checkbox';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ScrollTop from 'primevue/scrolltop';
import Chart from 'primevue/chart';
import Message from 'primevue/message';
import FileUpload from 'primevue/fileupload';



export default (app) => {
    app.component('MultiSelect', MultiSelect);
    app.component('Dropdown', Dropdown);
    app.component('Divider', Divider);
    app.component('Avatar', Avatar);
    app.component('ColorPicker', ColorPicker);
    app.component('Button', Button);
    app.component('Dialog', Dialog);
    app.component('InputText', InputText);
    app.component('InputNumber', InputNumber);
    app.component('Checkbox', Checkbox);
    app.component('DataTable', DataTable);
    app.component('Column', Column);
    app.component('ScrollTop', ScrollTop);
    app.component('Chart', Chart);
    app.component('Message', Message);
    app.component('FileUpload', FileUpload);
};
