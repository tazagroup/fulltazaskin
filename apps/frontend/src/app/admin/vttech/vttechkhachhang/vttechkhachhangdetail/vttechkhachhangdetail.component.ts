import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VttechkhachhangService } from '../vttechkhachhang.service';
import { VttechthanhtoanService } from '../../vttechthanhtoan/vttechthanhtoan.service';
import { VttechdieutriService } from '../../vttechdieutri/vttechdieutri.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LichhenService } from '../../../lichhen/lichhen.service';
import { VttechlichhenService } from '../../vttechlichhen/vttechlichhen.service';

@Component({
  selector: 'app-vttechkhachhangdetail',
  templateUrl: './vttechkhachhangdetail.component.html',
  styleUrls: ['./vttechkhachhangdetail.component.css'],
})
export class VttechkhachhangdetailComponent implements OnInit {
  constructor(private route: ActivatedRoute) {}
  _VttechkhachhangService: VttechkhachhangService = inject(
    VttechkhachhangService
  );
  _VttechthanhtoanService: VttechthanhtoanService = inject(
    VttechthanhtoanService
  );
  _VttechdieutriService: VttechdieutriService = inject(VttechdieutriService);
  _VttechlichhenService: VttechlichhenService = inject(VttechlichhenService);
  VTKhachhang: any;
  VTDieutri: any;
  VTLichhen: any;
  VTThanhtoan: any[] = []; // Your existing VTThanhtoan array
  displayedColumns: string[] = [
    'Code',
    'CustName',
    'SDT',
    'InvoiceNum',
    'Created',
    'Amount',
    'PriceDiscounted',
    'Paid',
    'Debt',
    'Status',
  ];

  ThanhtoanColumns: string[] = [
    'TabCode',
    'PosName',
    'TransferName',
    'Paid',
    'DiscountAmount',
    'DepositAmountUsing',
    'TotalPaid',
    'DebtAmount',
    'KTVID',
    'VoucherName',
    'DiscountName',
    'TimetoUsing',
    'ID',
    'TabID',
    'TabCardID',
    'MedicineID',
    'DepositID',
    'Code',
    'BranchID',
    'CustCode',
    'CustName',
    'CustPhone',
    'CustAddress',
    'CustBirthday',
    'ServiceID',
    'Quantity',
    'PriceRoot',
    'PriceUnit',
    'Price',
    'Amount',
    'MethodName',
    'Content',
    'TimeToTreatment',
    'PercentOfService',
    'TreatIndex',
    'Type',
    'TypeName',
    'ConsultID1',
    'ConsultID2',
    'ConsultID3',
    'ConsultID4',
    'TechID',
    'Tele1',
    'Tele2',
    'Created',
    'CreatedBy',
    'Modified',
    'State'
  ];
  DieutriColumns: string[] = [
    'Name',
    'Code',
    'CodeOld',
    'DocCode',
    'ServiceID',
    'ServiceTypeID',
    'ServiceCode',
    'TabID',
    'TabCode',
    'ComboID',
    'ComboCode',
    'ServiceName',
    'TimeIndex',
    'TimeToTreatment',
    'TeethChoosing',
    'PriceUnit',
    'Quantity',
    'Discount',
    'PriceRoot',
    'PriceDiscounted',
    'TimeToTreatmentDuLieu', // Note: Duplicate key, renamed to avoid conflict
    'TimeTreatIndex',
    'Note',
    'Content',
    'ContentNext',
    'Symptoms',
    'TreatDateNext',
    'BranchIDDuLieu', // Note: Duplicate key, renamed to avoid conflict
    'CreatedDate',
    'CreatedBy',
    'ModifiedDate',
    'ModifiedBy',
    'State'
  ];

  LichhenColumns: string[] = [
    'Code',
    'CustName',
    'CustID',
    'CustCode',
    'DateFrom',
    'StatusName',
    'StatusTime',
    'IsCancel',
    'BranchName',
    'Content',
    'Note',
    'NoteForBranch',
    'TypeID',
    'TypeDetailID',
    'CreatedBy',
    'CreatedDate',
    'ModifiedDate',
    'ConsultID',
    'DoctorID',
    'DoctorID2',
    'RoomID',
    'Room',
    'RemindContent',
    'ServiceCareID',
    'ServiceCare',
    'ReasonCancelID'
  ];


  dataSource!: MatTableDataSource<any>;
  dataSourceDieutri!: MatTableDataSource<any>;
  dataSourceLichhen!: MatTableDataSource<any>;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngOnInit() {
    this.route.paramMap.subscribe((params: any) => {
      const Custcode = params.get('id');
      if (Custcode) {
        this._VttechkhachhangService
          .getVttechkhachhangByCode(Custcode)
          .subscribe((data: any) => {
            if (data) {
              console.log(data);
              this.VTKhachhang = data;
            }
          });
        this._VttechthanhtoanService
          .getThanhtoanbycustcode(Custcode)
          .subscribe((Thanhtoan: any) => {
            console.log(Thanhtoan);
            this.VTThanhtoan = Thanhtoan;
            this.dataSource = new MatTableDataSource(this.VTThanhtoan);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
          });
        this._VttechdieutriService
          .getDieutribycustcode(Custcode)
          .subscribe((Dieutri: any) => {
            this.VTDieutri = Dieutri;
            this.dataSourceDieutri = new MatTableDataSource(this.VTDieutri);
            this.dataSourceDieutri.sort = this.sort;
            this.dataSourceDieutri.paginator = this.paginator;
          });

        this._VttechlichhenService
          .getLichhenbycustcode(Custcode)
          .subscribe((Lichhen: any) => {
            console.log(Lichhen);

            this.VTLichhen = Lichhen;
            this.dataSourceLichhen = new MatTableDataSource(this.VTLichhen);
            this.dataSourceLichhen.sort = this.sort;
            this.dataSourceLichhen.paginator = this.paginator;
          });
      }
    });
  }
  applyFilter(event: Event,type:any) {
    const filterValue = (event.target as HTMLInputElement).value;

    switch (type) {
      case 'Thanhtoan':
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
          this.dataSource.paginator.firstPage();
        }
        break;
      case 'Dieutri':
        this.dataSourceDieutri.filter = filterValue.trim().toLowerCase();
        if (this.dataSourceDieutri.paginator) {
          this.dataSourceDieutri.paginator.firstPage();
        }
        break;
      case 'Lichhen':
        this.dataSourceLichhen.filter = filterValue.trim().toLowerCase();
        if (this.dataSourceLichhen.paginator) {
          this.dataSourceLichhen.paginator.firstPage();
        }
        break;
    }
  }
}
