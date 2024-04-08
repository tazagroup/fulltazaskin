import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
@Entity('vttechlieutrinh', {orderBy: { CreateAt: 'DESC' } })
export class VttechlieutrinhEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'text', collation: 'utf8_general_ci' })
  IDLieutrinh: string;
  @Column({ type: 'text', collation: 'utf8_general_ci' })
  SDT: string;
  @Column({ type: 'text', collation: 'utf8_general_ci' })
  Code: string;
  @Column({ type: 'text', collation: 'utf8_general_ci' })
  TenVttechlieutrinh: string;
  @Column({ type: 'bigint'})
  Price_Discounted: number;
  @Column({ type: 'bigint'})
  PaidAmount: number;
  @Column()
  IndexTreatment: number;
  @Column()
  TimeToTreatment: number;
  @Column({ type: 'text', collation: 'utf8_general_ci' })
  Title: string;
  @Column({ type: 'text', collation: 'utf8_general_ci' })
  Mota: string;
  @Column({ default: '' })
  Slug: string;
  @Column({collation: "utf8_general_ci",type:"simple-json",default: () => "('{}')" })
  Image: string;
  @Column({ default: '' })
  Type: string;
  @Column({ default: 1 })
  Ordering: number;
  @Column({ default: 0 })
  Status: number;
  @Column()
  Created: Date;
  @CreateDateColumn()
  CreateAt: Date;
  @UpdateDateColumn()
  UpdateAt: Date;
  @DeleteDateColumn()
  DeleteAt: Date;
  @Column({ nullable: true })
  idCreate: string;
}

// {
//     "ID": 117194,
//     "ConsultID": 147,
//     "TeleID": 147,
//     "CustCareID": 0,
//     "CreatedBy": 72,
//     "EmpIDCreatedBy": 147,
//     "Created": "2022-08-22T10:41:00",
//     "NumCreated": 20220822,
//     "Modified": "2023-05-16T10:30:45.603",
//     "ModifiedBy": 515,
//     "ChooseBy": 72,
//     "ChooseDate": "2022-08-22T10:41:29.253",
//     "Service_ID": 946,
//     "Discount_ID": 0,
//     "Code": "SP.30056.117194",
//     "PersonResID": 0,
//     "isProduct": 1,
//     "Number": 1,
//     "Discount_Percent": 0,
//     "Price_Root": 4000000,
//     "Discount_Amount": 0,
//     "Discount_Voucher": 0,
//     "DiscountForCus_Amount": 0,
//     "Discount_Amount_Doctor": 0,
//     "DiscountForCus_Percent": 0,
//     "Price_Discounted": 4000000,
//     "PaidAmount": 0,
//     "Card_Amount_Using": 0,
//     "Discount_CusGroup_Amount": 0,
//     "Discount_CusMem_Amount": 0,
//     "Quantity": 1,       
//     "Content": "",
//     "ServiceOld": "",
//     "TeethChoosing": "",
//     "TeethType": 0,
//     "ServiceName": "640 - LiftExpert serum - Serum nâng cơ, làm đầy, sáng da và săn chắc tức thì",
//     "Per_Export_Sale": 1,
//     "Per_Same_User": 1,
//     "Per_Same_Date": 0,
//     "Per_Is_Treated": 0,
//     "Per_Is_Paid": 0,
//     "Per_Is_PaidCom": 0,
//     "Per_Changed": 0,
//     "Per_Is_Labo": 0,
//     "Per_Is_Block": 0,
//     "Per_Treat_Lock": 0,
//     "Per_Record_Lock": 0,
//     "Per_Passing_Date": 1,
//     "Per_Is_Refund": 0,
//     "TimeToTreatment": 1,
//     "Tab_ID_New": 0,
//     "Tab_ID_Old": 0,
//     "ComboID": 0,
//     "ComboName": "",
//     "ComboCode": "",
//     "GuideDocument": "",
//     "WarrantyDocument": "",
//     "Treat_Index": 0,
//     "Percent": 0,
//     "PercentTeeth": 0,
//     "IsInstallment": 0,
//     "Installment_Term": 0,
//     "IsAllowInstall": 0,
//     "Installment_Fee": 0,
//     "Installment_Sup": "",
//     "IsChoose": 1,
//     "PatientRecordID": 0,
//     "IsDisable": 0,
//     "UserDisable": 0,
//     "IsFinish": 0,
//     "UserFinish": 0,
//     "DisableService_Permission": 0,
//     "User_Current": 72,
//     "BranchName": "Văn Phòng",
//     "BranchCode": "VPC",
//     "IndexTreatment": 0,
//     "PackageNumber": "",
//     "MonthWarranty": 0,
//     "StartTimeWarranty": "22-08-2022",
//     "EndTimeWarranty": "22-08-2022",
//     "Servicesource": "",
//     "UseInsurance": 0,
//     "InsurAmount": 0,
//     "InsurName": "",
//     "ExpiredDay": "1900-01-01T00:00:00",
//     "NumExpiredDay": 0,
//     "IsExpired": 1,
//     "ServiceUnit": "Đơn Vị Khác",
//     "VoucherCode": "",
//     "VoucherSeries": 0,
//     "Discount_Point": 0,
//     "HavingStage": 0,
//     "Vatper": 0,
//     "Vatamount": 0,
//     "TotalPaid": 0
// }